import type { Server } from 'socket.io';

import { logger } from '../../common/logger/logger';

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public setIO(io: Server): void {
    this.io = io;
  }

  public getIO(): Server | null {
    return this.io;
  }

  public notifyUser(userId: string, eventName: string, data: unknown): void {
    if (!this.io) {
      logger.warn(
        `SocketService: Cannot notify user ${userId}, IO server not set.`,
      );
      return;
    }
    logger.info(
      `SocketService: Emitting ${eventName} to user room user${userId}`,
    );
    this.io.to(`user${userId}`).emit(eventName, data);
    this.io.to(userId).emit(eventName, data);
  }

  public broadcast(eventName: string, data: unknown): void {
    if (!this.io) {
      logger.warn(
        `SocketService: Cannot broadcast ${eventName}, IO server not set.`,
      );
      return;
    }
    logger.info(
      `SocketService: Broadcasting ${eventName} to all connected clients`,
    );
    this.io.emit(eventName, data);
  }
}

export const socketService = SocketService.getInstance();
