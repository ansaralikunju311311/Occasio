// import "../shared/config/env"
import '../src/shared/loader/env';
import { createServer } from 'http';

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import app from './app';
import { AuthUser } from './common/type/auth.type';
import { initializaApp } from './shared/loader/index';
import { CreateToken } from './common/services/token.service';
import { seatLockCleanupService } from './infrastructure/services/seat-lock-cleanup.service';
import { logger } from './common/logger/logger';
import { verifyAccessToken } from './presentation/middlewares/verifyAccessToken.middleware';

import { HttpStatus } from './common/constants/http-status';

const tokenService = new CreateToken()
const startServer = async (): Promise<void> => {
  try {
    await initializaApp();
    seatLockCleanupService.start();
    const PORT = process.env.PORT || 5000;

    const httpServer = createServer(app);
    
    const io = new Server(httpServer,{
      cors:{
        origin:process.env.CLIENT_URL || 'http://localhost:5173',
        credentials:true,
      },
    });


//     io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
   
//    socket.data.user = token;
//   console.log('Socket token:', token);

//   if (!token) {
//     return next(new Error('Unauthorized'));
//   }

//       const payload = tokenService.verifyAccessToken(token) as AuthUser;
//       console.log('for the checking the', payload);
//   next();
// });
      io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    // const decoded = verifyAccessToken(token);
    const decode = tokenService.verifyAccessToken(token) as AuthUser

    socket.data.user = decode;
    console.log('for what inside that',decode)

    next();
  } catch (error) {
    console.log('error')
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error("TOKEN_EXPIRED"));
    }

    return next(new Error("INVALID_TOKEN"));
  }
});
    io.on('connection', (socket) => {
      logger.info(`the socket is connected${socket.id}`);
      console.log(`the connected user${socket.data.user.userId}`)
      const user = socket.data.user.userId;
      socket.join(`user${user}`)
    })
    // app.listen(PORT, () => {
    //   logger.info(`the server is running properly on port ${PORT}`);
    // });
    httpServer.listen(PORT, () => {
      logger.info(`the server is running properly on port${PORT}`)
    })
  } catch (error: unknown) {
    logger.error('Failed to start server:', error);
  }
};
startServer();
