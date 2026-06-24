import mongoose from 'mongoose';
import QRCode from 'qrcode';
import {  BookingStatus } from '../../../../infrastructure/database/model/booking.model';
import { Booking } from '../../../../domain/entities/booking.entity';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';
import { IConfirmBookingUseCase } from './confirm-booking.interface.usecase';
import { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import { ISeatRepository } from '../../../../domain/repositories/seats/seat.repository.interface';
import { IQrCodeService } from '../../../../common/interfaces/qr.interface';
import { ITransactionManager } from '../../../../domain/services/transaction-manager.interface';
export class ConfirmBookingUseCase implements IConfirmBookingUseCase{

  constructor(
    private bookingRepository:IBookingRepository,
    private seatRepository:ISeatRepository,
    private  qrCode :IQrCodeService,
      private transactionManager: ITransactionManager

  ){

  }
  async execute(
    userId: string,
    eventId: string,
    seatIds: string[],
    paymentId: string,
    totalAmount: number,
    bookingType: 'physical' | 'online'
  ) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    const session = await this.transactionManager.start();

    try {
      // const seats = await SeatModel.find({ seatNumber: { $in: seatIds }, eventId }).session(session);
      const seats = await this.seatRepository.findSeats(seatIds,eventId,session)
      for (const seat of seats) {
        if (seat.status !== SeatStatus.LOCKED) {
          throw new Error(`Seat ${seat.seatNumber} is no longer locked.`);
        }
        if (seat.lockedBy?.toString() !== userId) {
          throw new Error(`Seat ${seat.seatNumber} is not locked by you.`);
        }
      }
      // await SeatModel.updateMany(
      //   { seatNumber: { $in: seatIds }, eventId },
      //   { 
      //     $set: { status: SeatStatus.BOOKED },
      //     $unset: { lockExpiresAt: 1 } 
      //   },
      //   { session }
      // );

      await this.seatRepository.markBooked(eventId,
        seatIds,
        session)
      const bookingReference = `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const qrDataString = JSON.stringify({
        ref: bookingReference,
        userId,
        eventId,
        seats: seats.map(s => s.seatNumber)
      });
      // const qrCodeData = await QRCode.toDataURL(qrDataString);
      const qrCodeData = await this.qrCode.execute(qrDataString)
      const commissionAmount = totalAmount * 0.10;
      const organizerRevenue = totalAmount - commissionAmount;
      const newBooking = await this.bookingRepository.saveBooking(new Booking(
        null,
        userId,
        eventId,
        seats.map(s => s.seatNumber),
        bookingType,
        totalAmount,
        commissionAmount,
        organizerRevenue,
        BookingStatus.CONFIRMED,
        paymentId,
        qrCodeData
      ));

     await this.transactionManager.commit(session);

      return {
        message: 'Booking confirmed successfully',
        booking: newBooking,
        bookingReference
      };
    } catch (error) {
      await this.transactionManager.rollback(session);
      throw error;
    }
  }
}
