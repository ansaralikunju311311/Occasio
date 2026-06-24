require('dotenv').config();
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  eventId: String,
  status: String,
  lockExpiresAt: Date,
  lockedBy: String,
  lockedAt: Date,
  block: String,
  row: Number,
  column: Number,
});

const SeatModel = mongoose.model('SeatTest', seatSchema);

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log('Connected successfully');

    const now = new Date();
    const lockExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    const result = await SeatModel.findOneAndUpdate(
      {
        seatNumber: 'A-1-1',
        eventId: '60d5ecb54cb8a9001f3e58b1',
        $or: [
          { status: 'AVAILABLE' },
          { status: 'LOCKED', lockExpiresAt: { $lt: now } },
        ],
      },
      {
        $set: {
          status: 'LOCKED',
          lockedBy: '123',
          lockedAt: now,
          lockExpiresAt: lockExpiresAt,
        },
        $setOnInsert: {
          block: 'A',
          row: 1,
          column: 1,
        },
      },
      { new: true, upsert: true },
    );

    console.log('Result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
run();
