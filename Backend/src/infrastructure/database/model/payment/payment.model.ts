import { Document, Schema, model } from 'mongoose';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';

export interface IPaymentDocument extends Document {
  userId: Schema.Types.ObjectId;
  purpose: PaymentPurpose;
  eventId?: Schema.Types.ObjectId;
  bookingId?: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus;
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
      enum: Object.values(PaymentPurpose),
      required: true,
    },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' }, // Assuming Booking model will exist
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const PaymentModel = model<IPaymentDocument>('Payment', paymentSchema);
