import { BookingStatus } from '../../../../common/enums/booking-status.enum';
import { Booking } from '../../../../domain/entities/booking.entity';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';
import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import type { ISeatRepository } from '../../../../domain/repositories/seats/seat.repository.interface';
import type { IQrCodeService } from '../../../../common/interfaces/qr.interface';
import type { ITransactionManager } from '../../../../domain/services/transaction-manager.interface';

import type { IConfirmBookingUseCase } from './confirm-booking.interface.usecase';

export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
  constructor(
    private _bookingRepository: IBookingRepository,
    private _seatRepository: ISeatRepository,
    private _qrCode: IQrCodeService,
    private _transactionManager: ITransactionManager,
  ) {}

  async execute(
    userId: string,
    eventId: string,
    seatIds: string[],
    paymentId: string,
    totalAmount: number,
    bookingType: 'physical' | 'online',
  ) {
    const session = await this._transactionManager.start();

    try {
      const seats = await this._seatRepository.findSeats(
        seatIds,
        eventId,
        session,
      );
      for (const seat of seats) {
        if (seat.status !== SeatStatus.LOCKED) {
          throw new Error(`Seat ${seat.seatNumber} is no longer locked.`);
        }
        if (seat.lockedBy?.toString() !== userId) {
          throw new Error(`Seat ${seat.seatNumber} is not locked by you.`);
        }
      }

      await this._seatRepository.markBooked(eventId, seatIds, session);
      const bookingReference = `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const qrDataString = JSON.stringify({
        ref: bookingReference,
        userId,
        eventId,
        seats: seats.map((s) => s.seatNumber),
      });
      const qrCodeData = await this._qrCode.execute(qrDataString);
      const commissionAmount = totalAmount * 0.1;
      const organizerRevenue = totalAmount - commissionAmount;
      const newBooking = await this._bookingRepository.saveBooking(
        new Booking(
          null,
          userId,
          eventId,
          seats.map((s) => s.seatNumber),
          bookingType,
          totalAmount,
          commissionAmount,
          organizerRevenue,
          BookingStatus.CONFIRMED,
          paymentId,
          qrCodeData,
        ),
      );

      await this._transactionManager.commit(session);

      return {
        message: 'Booking confirmed successfully',
        booking: newBooking,
        bookingReference,
      };
    } catch (error) {
      await this._transactionManager.rollback(session);
      throw error;
    }
  }
}
