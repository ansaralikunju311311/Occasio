import { SeatModel } from '../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../common/enums/searstatus-enum';

export class FailBookingUseCase {
  async execute(userId: string, seatIds: string[]) {
    // Release locked seats belonging to this user
    const result = await SeatModel.updateMany(
      { 
        seatNumber: { $in: seatIds },
        lockedBy: userId,
        status: SeatStatus.LOCKED
      },
      {
        $set: { status: SeatStatus.AVAILABLE },
        $unset: { lockedBy: 1, lockedAt: 1, lockExpiresAt: 1 }
      }
    );

    return {
      message: 'Failed booking handled, seats released',
      releasedCount: result.modifiedCount
    };
  }
}
