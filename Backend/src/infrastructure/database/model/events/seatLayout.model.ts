import mongoose, { Schema, Document } from 'mongoose';

export interface ISeatLayout extends Document {
  eventId: Schema.Types.ObjectId;
  blocks: {
    blockName: string;
    rows: { rowNumber: number; columns: number }[];
    category: {
      name: string;
      price: number;
    };
  }[];
}

const SeatLayoutSchema = new Schema<ISeatLayout>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    blocks: [
      {
        blockName: String,
        rows: [
          {
            rowNumber: Number,
            columns: Number,
          },
        ],
        category: {
          name: String,
          price: Number,
        },
      },
    ],
  },
  { timestamps: true },
);
export const SeatLayoutModel = mongoose.model('SeatLayout', SeatLayoutSchema);
