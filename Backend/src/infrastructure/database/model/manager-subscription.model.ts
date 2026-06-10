import mongoose, { Document, Schema } from 'mongoose';
import {PlanType} from '../../../common/enums/plan-enum';
import { ManagerSubscriptionStatus } from '../../../common/enums/manager-subscription-status.enum';

export interface IManagerSubscriptionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  plan: PlanType;
  status: ManagerSubscriptionStatus;
  eventLimit: number;
  eventsUsed: number;
  startDate: Date;
  endDate?: Date;
}

const managerSubscriptionSchema = new Schema<IManagerSubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: Object.values(PlanType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ManagerSubscriptionStatus),
      required: true,
    },
    eventLimit: {
      type: Number,
      required: true,
    },
    eventsUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const ManagerSubscriptionModel = mongoose.model<IManagerSubscriptionDocument>('ManagerSubscription', managerSubscriptionSchema);
