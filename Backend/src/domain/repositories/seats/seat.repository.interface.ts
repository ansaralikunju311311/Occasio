import type { IDbSession } from '../../services/transaction-manager.interface';
import type { SeatStatus } from '../../../common/enums/searstatus-enum';

export interface ISeatData {
  _id?: string;
  eventId: string;
  layoutId?: string;
  block: string;
  row: number;
  column: number;
  seatNumber: string;
  categoryName: string;
  price: number;
  status: SeatStatus;
  lockedBy?: string;
  lockedAt?: Date;
  lockExpiresAt?: Date;
}

export interface ISeatRepository {
  lockSeats(
    userId: string,
    eventId: string,
    seatIds: string,
    now: Date,
    lockExpiresAt: Date,
  ): Promise<{ _id: string } | null>;

  releaseSeats(seatIds: string[]): Promise<number>;

  findSeats(
    seatIds: string[],
    eventId: string,
    session?: IDbSession,
  ): Promise<ISeatData[]>;

  markBooked(
    eventId: string,
    seatIds: string[],
    session?: IDbSession,
  ): Promise<void>;

  upsertSeat(seatData: {
    eventId: string;
    layoutId?: string;
    block: string;
    row: number;
    column: number;
    seatNumber: string;
    price: number;
    categoryName: string;
    status: SeatStatus;
  }): Promise<void>;

  checkBookedSeats(eventId: string, seatNumbers: string[]): Promise<string[]>;
}
