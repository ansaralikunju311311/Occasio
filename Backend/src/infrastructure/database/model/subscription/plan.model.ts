import mongoose, { Document, Schema } from "mongoose";
import { PlanType } from "../../../../common/enums/plan-enum";

export interface IPlanDocument extends Document {
  name: PlanType;
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
      enum: Object.values(PlanType),
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
  { timestamps: true }
);

export const SubscriptionModel = mongoose.model<IPlanDocument>(
  "Subscription",
  PlanSchema
);