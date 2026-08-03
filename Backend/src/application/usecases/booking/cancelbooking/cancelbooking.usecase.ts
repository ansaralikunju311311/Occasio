import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import { BookingStatus } from '../../../../common/enums/booking-status.enum';
import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { UserRepository } from '../../../../infrastructure/repositories/user/user.repository';
import { PaymentRepository } from '../../../../infrastructure/repositories/payment/payment.repository';
import { Payment } from '../../../../domain/entities/payment.entity';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { calculateRefundPercentage } from '../../../../common/utils/refund';

import type { ICancelBooking } from './cancelbooking.usecase.interface';

export class CancelBooking implements ICancelBooking {
  private _userRepository = new UserRepository();
  private _paymentRepository = new PaymentRepository();

  constructor(
    private _booking: IBookingRepository,
    private _event: IEventRepository,
  ) {}

  async execute(bookingId: string, userId: string): Promise<void> {
    const bookingDetails = await this._booking.findBookingById(bookingId);
    if (!bookingDetails) {
      throw new Error('Booking details not found');
    }
    if (userId !== String(bookingDetails.userId)) {
      throw new Error('Booking does not belong to this user');
    }
    if (bookingDetails.status === BookingStatus.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }
    const eventDetails = await this._event.findByIdEvents(
      bookingDetails.eventId,
    );
    if (!eventDetails) {
      throw new Error('Event not found');
    }

    const today = new Date();
    if (today > eventDetails.startTime) {
      throw new Error('Cannot cancel booking after the event has started');
    }

    const refundPercentage = calculateRefundPercentage(
      eventDetails.publishedAt,
      eventDetails.startTime,
      today,
    );

    if (refundPercentage === 0) {
      throw new Error(
        'Cancellation is not available less than 24 hours before the event starts.',
      );
    }

    const refundAmount = Math.round(
      (bookingDetails.totalAmount * refundPercentage) / 100,
    );

    await this._booking.updateBookingStatus(bookingId, BookingStatus.CANCELLED);

    if (refundAmount > 0) {
      const user = await this._userRepository.findByIdUser(
        bookingDetails.userId,
      );
      if (user) {
        user.walletBalance = (user.walletBalance || 0) + refundAmount;
        await this._userRepository.updateUser(user);

        const refundPayment = new Payment(
          null,
          bookingDetails.userId,
          PaymentPurpose.REFUND,
          refundAmount,
          'INR',
          'WALLET',
          PaymentStatus.SUCCESS,
          `refund_${bookingDetails.id}_${Date.now()}`,
          bookingDetails.eventId,
          bookingDetails.id ?? undefined,
          new Date(),
        );
        await this._paymentRepository.savePayment(refundPayment);
      }
    }
  }
}
