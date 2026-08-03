import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IChatDocument extends Document {
  eventId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChatDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const ChatModel = mongoose.model<IChatDocument>(
  'ChatMessage',
  ChatSchema,
);
