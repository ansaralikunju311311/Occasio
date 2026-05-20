import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IBookingDocument extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  seats: string[];
  bookingType: 'physical' | 'online';
  totalAmount: number;
  commissionAmount: number;
  organizerRevenue: number;
  status: BookingStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seats: [{ type: String }],
    bookingType: { type: String, enum: ['physical', 'online'], required: true },
    totalAmount: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    organizerRevenue: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<IBookingDocument>('Booking', BookingSchema);
