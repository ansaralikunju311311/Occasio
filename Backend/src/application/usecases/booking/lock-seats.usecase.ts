import { EventModel } from '../../../infrastructure/database/model/events/event.model';
import { SeatModel } from '../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../common/enums/searstatus-enum';
import { EventStatus } from '../../../common/enums/eventstatus-enum';

export class LockSeatsUseCase {
  async execute(userId: string, eventId: string, seatIds: string[]) {
    // 1. Fetch event and validate
    const event = await EventModel.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.status === EventStatus.CANCELED) throw new Error('Event is cancelled');
    // if (event.endTime < new Date()) throw new Error('Event has expired');
    if (event.createdBy.toString() === userId) throw new Error('Event manager cannot book their own event');
    
    // Check maximum seats per booking
    if (seatIds.length > 5) {
        throw new Error('Maximum 5 seats allowed per booking');
    }

    // Note: online max capacity validation would be done if booking online, this handles physical seats

    const now = new Date();
    const lockExpiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    // 2. Try to lock seats using findOneAndUpdate to prevent double booking
    const lockedSeats: any[] = [];
    try {
      for (const seatNumber of seatIds) {
        // Try to update an existing seat OR upsert a new one if it's completely new (never interacted with)
        const updatedSeat = await SeatModel.findOneAndUpdate(
          { 
            seatNumber: seatNumber, 
            eventId: eventId,
            $or: [
              { status: SeatStatus.AVAILABLE },
              { status: SeatStatus.LOCKED, lockExpiresAt: { $lt: now } }
            ]
          },
          {
            $set: {
              status: SeatStatus.LOCKED,
              lockedBy: userId,
              lockedAt: now,
              lockExpiresAt: lockExpiresAt
            },
            $setOnInsert: {
              // Extract block, row, column from seatNumber (e.g. "A-1-1")
              block: seatNumber.split('-')[0],
              row: parseInt(seatNumber.split('-')[1] || '0'),
              column: parseInt(seatNumber.split('-')[2] || '0'),
            }
          },
          { new: true, upsert: true }
        );

        if (!updatedSeat) {
          throw new Error(`Seat ${seatNumber} is already booked or locked by another user`);
        }
        lockedSeats.push(updatedSeat);
      }
    } catch (error) {
      // Rollback: if any seat fails, release the ones we successfully locked in this batch
      if (lockedSeats.length > 0) {
        await SeatModel.updateMany(
          { _id: { $in: lockedSeats.map(s => s._id) } },
          {
            $set: { status: SeatStatus.AVAILABLE },
            $unset: { lockedBy: 1, lockedAt: 1, lockExpiresAt: 1 }
          }
        );
      }
      throw error;
    }

    return { message: 'Seats locked successfully', lockedSeats };
  }
}
