// import "../shared/config/env"
import '../src/shared/loader/env';
import app from './app';
import { initializaApp } from './shared/loader/index';
import { seatLockCleanupService } from './infrastructure/services/seat-lock-cleanup.service';
import { logger } from './common/logger/logger';

const startServer = async (): Promise<void> => {
  try {
    await initializaApp();
    seatLockCleanupService.start();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`the server is running properly on port ${PORT}`);
    });
  } catch (error: unknown) {
    logger.error('Failed to start server:', error);
  }
};
startServer();
