/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ISeatRepository } from '../../../domain/repositories/seats/seat.repository.interface';
import { SeatModel } from '../../database/model/events/seat.model';
import { SeatStatus } from '../../../common/enums/searstatus-enum';

export class SeatRepository implements ISeatRepository {
  async lockSeats(
    userId: string,
    eventId: string,
    seatNumber: string,
    now: Date,
    lockExpiresAt: Date,
  ): Promise<any> {
    return await SeatModel.findOneAndUpdate(
      {
        seatNumber,
        eventId,
        $or: [
          { status: SeatStatus.AVAILABLE },
          {
            status: SeatStatus.LOCKED,
            lockExpiresAt: { $lt: now },
          },
        ],
      },
      {
        $set: {
          status: SeatStatus.LOCKED,
          lockedBy: userId,
          lockedAt: now,
          lockExpiresAt,
        },
        $setOnInsert: {
          block: seatNumber.split('-')[0],
          row: parseInt(seatNumber.split('-')[1] || '0'),
          column: parseInt(seatNumber.split('-')[2] || '0'),
        },
      },
      { new: true, upsert: true },
    );
  }

  async releaseSeats(seatIds: string[]): Promise<number> {
    const result = await SeatModel.updateMany(
      { _id: { $in: seatIds } },
      {
        $set: {
          status: SeatStatus.AVAILABLE,
        },
        $unset: {
          lockedBy: 1,
          lockedAt: 1,
          lockExpiresAt: 1,
        },
      },
    );
    return result.modifiedCount;
  }

  async findSeats(
    seatIds: string[],
    eventId: string,
    session?: any,
  ): Promise<any[]> {
    return await SeatModel.find({
      seatNumber: { $in: seatIds },
      eventId,
    }).session(session);
  }

  async markBooked(
    eventId: string,
    seatIds: string[],
    session?: any,
  ): Promise<void> {
    await SeatModel.updateMany(
      { seatNumber: { $in: seatIds }, eventId },
      {
        $set: { status: SeatStatus.BOOKED },
        $unset: { lockExpiresAt: 1 },
      },
      { session },
    );
  }
}
