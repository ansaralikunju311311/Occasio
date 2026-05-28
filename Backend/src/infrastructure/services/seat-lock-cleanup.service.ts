import cron from 'node-cron';
import { SeatModel } from '../database/model/events/seat.model';
import { SeatStatus } from '../../common/enums/searstatus-enum';

class SeatLockCleanupService {
  public start() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        
        // Find all seats that are LOCKED and their lockExpiresAt is in the past
        const result = await SeatModel.updateMany(
          {
            status: SeatStatus.LOCKED,
            lockExpiresAt: { $lt: now },
          },
          {
            $set: { status: SeatStatus.AVAILABLE },
            $unset: { lockedBy: 1, lockedAt: 1, lockExpiresAt: 1 },
          }
        );

        if (result.modifiedCount > 0) {
          console.log(`[SeatLockCleanup] Released ${result.modifiedCount} expired seat locks.`);
        }
      } catch (error) {
        console.error('[SeatLockCleanup] Error cleaning up expired locks:', error);
      }
    });
    console.log('[SeatLockCleanup] Cron job initialized.');
  }
}

export const seatLockCleanupService = new SeatLockCleanupService();
