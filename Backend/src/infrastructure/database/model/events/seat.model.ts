import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import { SeatStatus } from '../../../../common/enums/searstatus-enum';
export interface ISeat extends Document {
  eventId: Schema.Types.ObjectId;
  layoutId: Schema.Types.ObjectId;
  block: string;
  row: number;
  column: number;
  seatNumber: string;

  categoryName: string;
  price: number;

  status: SeatStatus;
  lockedBy?: Schema.Types.ObjectId;
  lockedAt?: Date;
  lockExpiresAt?: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    layoutId: { type: Schema.Types.ObjectId, ref: 'SeatLayout' },

    block: String,
    row: Number,
    column: Number,
    price: Number,
    seatNumber: { type: String, required: true },
    categoryName: String,
    status: {
      type: String,
      enum: Object.values(SeatStatus),
      default: SeatStatus.AVAILABLE,
    },
    lockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lockedAt: Date,
    lockExpiresAt: Date,
  },
  { timestamps: true },
);

SeatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });
export const SeatModel = mongoose.model('Seat', SeatSchema);
