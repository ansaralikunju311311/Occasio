import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IPlanDocument extends Document {
  name: string;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlanDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
    },
    eventLimit: {
      type: Number,
      required: true,
    },
    commissionPercentage: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const SubscriptionModel = mongoose.model<IPlanDocument>(
  'Subscription',
  PlanSchema,
);
