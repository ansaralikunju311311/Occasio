import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import type { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IDeleteEventUseCase } from './deleteevent.usecase.interface';
import { razorpayInstance } from '../../../../infrastructure/config/razorpay';
import { logger } from '../../../../common/logger/logger';

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
    private _paymentRepository: IPaymentRepository,
    private _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const event = await this._eventRepository.findByIdEvents(id);
    if (!event) {
      return false;
    }

    if (new Date(event.startTime) <= new Date()) {
      throw new Error('Event has already started and cannot be deleted.');
    }

    const confirmedBookings = await this._bookingRepository.findConfirmedBookingsByEventId(id);

    for (const booking of confirmedBookings) {
      try {
        const payment = await this._paymentRepository.findPaymentByBookingId(booking.id ?? '');
        if (payment && payment.transactionId) {
          const isMock = payment.transactionId.startsWith('mock_pay_') || payment.transactionId.startsWith('pay_mock');
          if (!isMock) {
            try {
              await razorpayInstance.payments.refund(payment.transactionId, {
                amount: booking.totalAmount * 100, // in paise
              });
              logger.info(`Successfully refunded booking ${booking.id} via Razorpay (transaction: ${payment.transactionId})`);
            } catch (rzErr: any) {
              logger.error(`Razorpay refund API call failed for payment ID ${payment.transactionId}:`, rzErr);
            }
          } else {
            logger.info(`Skipped Razorpay refund for mock payment ID ${payment.transactionId}`);
          }
        }
      } catch (err: any) {
        logger.error(`Error processing refund for booking ${booking.id}:`, err);
      }

      try {
        await this._bookingRepository.updateBookingStatus(booking.id ?? '', 'CANCELLED');
      } catch (err: any) {
        logger.error(`Failed to update booking status for ${booking.id} to CANCELLED:`, err);
      }

      try {
        const user = await this._userRepository.findByIdUser(booking.userId);
        if (user) {
          user.walletBalance = (user.walletBalance || 0) + booking.totalAmount;
          await this._userRepository.updateUser(user);
          logger.info(`Credited ₹${booking.totalAmount} to user ${user.email}'s wallet. New balance: ₹${user.walletBalance}`);
        } else {
          logger.error(`Could not find user ${booking.userId} to credit refund wallet balance.`);
        }
      } catch (err: any) {
        logger.error(`Failed to credit user ${booking.userId} wallet balance:`, err);
      }
    }

    return await this._eventRepository.deleteEvent(id);
  }
}
