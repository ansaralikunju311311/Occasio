import mongoose from 'mongoose';
import QRCode from 'qrcode';
import { BookingModel, BookingStatus } from '../../../infrastructure/database/model/booking.model';
import { SeatModel } from '../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../common/enums/searstatus-enum';

export class ConfirmBookingUseCase {
  async execute(
    userId: string,
    eventId: string,
    seatIds: string[],
    paymentId: string,
    totalAmount: number,
    bookingType: 'physical' | 'online'
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Verify seats are locked by this user
      const seats = await SeatModel.find({ seatNumber: { $in: seatIds }, eventId }).session(session);
      
      for (const seat of seats) {
        if (seat.status !== SeatStatus.LOCKED) {
          throw new Error(`Seat ${seat.seatNumber} is no longer locked.`);
        }
        if (seat.lockedBy?.toString() !== userId) {
          throw new Error(`Seat ${seat.seatNumber} is not locked by you.`);
        }
      }

      // 2. Change seat status from LOCKED -> BOOKED
      await SeatModel.updateMany(
        { seatNumber: { $in: seatIds }, eventId },
        { 
          $set: { status: SeatStatus.BOOKED },
          $unset: { lockExpiresAt: 1 } 
        },
        { session }
      );

      // 3. Create Booking Document
      // Generate QR Code data
      const bookingReference = `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const qrDataString = JSON.stringify({
        ref: bookingReference,
        userId,
        eventId,
        seats: seats.map(s => s.seatNumber)
      });
      const qrCodeData = await QRCode.toDataURL(qrDataString);

      // Dummy calculation for commission
      const commissionAmount = totalAmount * 0.10;
      const organizerRevenue = totalAmount - commissionAmount;

      const newBooking = await BookingModel.create([{
        userId,
        eventId,
        seats: seats.map(s => s.seatNumber), // Or store seatIds, depends on schema
        bookingType,
        totalAmount,
        commissionAmount,
        organizerRevenue,
        status: BookingStatus.CONFIRMED,
        paymentId,
        qrCodeData
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return {
        message: 'Booking confirmed successfully',
        booking: newBooking[0],
        bookingReference
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
