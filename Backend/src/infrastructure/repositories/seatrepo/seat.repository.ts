import type { ClientSession } from 'mongoose';

import type {
  ISeatRepository,
  ISeatData,
} from '../../../domain/repositories/seats/seat.repository.interface';
import { SeatModel } from '../../database/model/events/seat.model';
import type { ISeat } from '../../database/model/events/seat.model';
import { SeatStatus } from '../../../common/enums/searstatus-enum';

export class SeatRepository implements ISeatRepository {
  async lockSeats(
    userId: string,
    eventId: string,
    seatNumber: string,
    now: Date,
    lockExpiresAt: Date,
  ): Promise<{ _id: string } | null> {
    const result = await SeatModel.findOneAndUpdate(
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
    if (!result) {
      return null;
    }
    return { _id: result._id.toString() };
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
    session?: ClientSession,
  ): Promise<ISeatData[]> {
    const seats = (await SeatModel.find({
      seatNumber: { $in: seatIds },
      eventId,
    }).session(session ?? null)) as unknown as ISeat[];

    return seats.map((s: ISeat) => ({
      _id: s._id.toString(),
      eventId: s.eventId?.toString() ?? '',
      layoutId: s.layoutId?.toString(),
      block: s.block ?? '',
      row: s.row ?? 0,
      column: s.column ?? 0,
      seatNumber: s.seatNumber,
      categoryName: s.categoryName ?? '',
      price: s.price ?? 0,
      status: s.status,
      lockedBy: s.lockedBy?.toString(),
      lockedAt: s.lockedAt,
      lockExpiresAt: s.lockExpiresAt,
    }));
  }

  async markBooked(
    eventId: string,
    seatIds: string[],
    session?: ClientSession,
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

  async upsertSeat(seatData: {
    eventId: string;
    layoutId?: string;
    block: string;
    row: number;
    column: number;
    seatNumber: string;
    price: number;
    categoryName: string;
    status: SeatStatus;
  }): Promise<void> {
    await SeatModel.findOneAndUpdate(
      { eventId: seatData.eventId, seatNumber: seatData.seatNumber },
      {
        eventId: seatData.eventId,
        layoutId: seatData.layoutId,
        block: seatData.block,
        row: seatData.row,
        column: seatData.column,
        seatNumber: seatData.seatNumber,
        price: seatData.price,
        categoryName: seatData.categoryName,
        status: seatData.status,
      },
      { upsert: true, new: true },
    );
  }
}
