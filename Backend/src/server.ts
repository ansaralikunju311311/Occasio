// import "../shared/config/env"
import '../src/shared/loader/env';
import { createServer } from 'http';

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import app from './app';
import type { AuthUser } from './common/type/auth.type';
import { initializaApp } from './shared/loader/index';
import { CreateToken } from './common/services/token.service';
import { seatLockCleanupService } from './infrastructure/services/seat-lock-cleanup.service';
import { socketService } from './infrastructure/services/socket.service';
import { logger } from './common/logger/logger';
import { registerLiveSocketHandler } from './infrastructure/services/live-socket.handler';

const tokenService = new CreateToken();
const startServer = async (): Promise<void> => {
  try {
    await initializaApp();
    seatLockCleanupService.start();
    const PORT = process.env.PORT || 5000;

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    socketService.setIO(io);

    io.use((socket, next) => {
      try {
        let token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization;

        if (!token) {
          return next(new Error('Authentication required'));
        }

        if (token.startsWith('Bearer ')) {
          token = token.slice(7);
        }

        const decode = tokenService.verifyAccessToken(token) as AuthUser;

        socket.data.user = decode;
        logger.info(
          `⚡ Socket client authenticated successfully: ${JSON.stringify(decode)}`,
        );

        next();
      } catch (error) {
        logger.error(`❌ Socket authentication error: ${String(error)}`);
        if (error instanceof jwt.TokenExpiredError) {
          return next(new Error('TOKEN_EXPIRED'));
        }

        return next(new Error('INVALID_TOKEN'));
      }
    });
    io.on('connection', (socket) => {
      const user = socket.data.user?.userId || socket.data.user?.id;
      logger.info(`Socket connected: ${socket.id}, User ID: ${user}`);
      if (user) {
        const uStr = user.toString();
        socket.join(`user${uStr}`);
        socket.join(uStr);
        logger.info(
          `Socket ${socket.id} joined rooms: user${uStr} and ${uStr}`,
        );
      }

      registerLiveSocketHandler(io, socket);
    });
    // app.listen(PORT, () => {
    //   logger.info(`the server is running properly on port ${PORT}`);
    // });
    httpServer.listen(PORT, () => {
      logger.info(`the server is running properly on port${PORT}`);
    });
  } catch (error: unknown) {
    logger.error('Failed to start server:', error);
  }
};
startServer();
