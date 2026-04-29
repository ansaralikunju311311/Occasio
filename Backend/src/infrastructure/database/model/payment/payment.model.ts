import { Document, Schema, model } from 'mongoose';

export interface IPaymentDocument extends Document {
  userId: Schema.Types.ObjectId;
  purpose: 'EVENT_PUBLISH' | 'BOOKING' | 'SUBSCRIPTION';
  eventId?: Schema.Types.ObjectId;
  bookingId?: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionId: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    purpose: {
      type: String,
      enum: ['EVENT_PUBLISH', 'BOOKING', 'SUBSCRIPTION'],
      required: true,
    },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' }, // Assuming Booking model will exist
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const PaymentModel = model<IPaymentDocument>('Payment', paymentSchema);
