import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

import { EventType } from '../../../../common/enums/event-type';
import { EventStatus } from '../../../../common/enums/eventstatus-enum';

export interface IEventDocument extends Document {
  title: string;
  description: string;
  eventType: EventType;
  startTime: Date;
  endTime: Date;

  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };

  maxOnlineUsers: number;
  price: number;

  createdBy: Schema.Types.ObjectId;
  status: EventStatus;
  picture: string;
  seatLayoutId: Schema.Types.ObjectId;

  isPublished: boolean;
  isDeleted: boolean;
  deletedAt: Date;
}

const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      },
      address: {
        type: String,
      },
    },

    maxOnlineUsers: Number,
    price: Number,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      required: true,
    },
    seatLayoutId: {
      type: Schema.Types.ObjectId,
      ref: 'SeatLayout',
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);
eventSchema.virtual('seats', {
  ref: 'Seat',
  localField: '_id',
  foreignField: 'eventId',
});

eventSchema.set('toObject', { virtuals: true });
eventSchema.set('toJSON', { virtuals: true });

eventSchema.index({ location: '2dsphere' });

// TTL index to delete DRAFT events after 24 hours
eventSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400, // 24 hours
    partialFilterExpression: { status: EventStatus.DRAFT },
  },
);

export const EventModel = model<IEventDocument>('Event', eventSchema);
