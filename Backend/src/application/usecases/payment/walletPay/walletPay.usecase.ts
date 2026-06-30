import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import type { ISeatRepository } from '../../../../domain/repositories/seats/seat.repository.interface';
import type { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import { Booking } from '../../../../domain/entities/booking.entity';
import { BookingStatus } from '../../../../common/enums/booking-status.enum';
import { SeatModel } from '../../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';
import { Payment } from '../../../../domain/entities/payment.entity';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';
import type { IWalletPayUseCase } from './walletPay.usecase.interface';

export class WalletPayUseCase implements IWalletPayUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _bookingRepository: IBookingRepository,
    private _seatRepository: ISeatRepository,
    private _paymentRepository: IPaymentRepository,
  ) {}

  async execute(
    eventId: string,
    userId: string,
    amount: number,
    bookingType: 'physical' | 'online',
    seats?: string[],
  ): Promise<any> {
    const event = await this._eventRepository.findByIdEvents(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.createdBy.toString() === userId.toString()) {
      throw new Error('You cannot book your own event.');
    }

    const user = await this._userRepository.findByIdUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if ((user.walletBalance || 0) < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // 3. Verify seats are not already booked (for physical booking)
    if (bookingType === 'physical' && seats && seats.length > 0) {
      const alreadyBooked = await SeatModel.find({
        eventId,
        seatNumber: { $in: seats },
        status: SeatStatus.BOOKED,
      });

      if (alreadyBooked.length > 0) {
        throw new Error(
          `Some seats are already booked: ${alreadyBooked.map((s) => s.seatNumber).join(', ')}`,
        );
      }
    }

    const creator = await this._userRepository.findByIdUser(event.createdBy);
    let commissionPercentage = 10; // Default 10% if no active subscription

    if (creator && creator.activeSubscription) {
      const plan = await this._subscriptionRepository.findPlanById(
        creator.activeSubscription,
      );
      if (plan) {
        commissionPercentage = plan.commissionPercentage;
      }
    }

    const commissionAmount = parseFloat(
      (amount * (commissionPercentage / 100)).toFixed(2),
    );
    const totalAmount = amount;
    const organizerRevenue = parseFloat((amount - commissionAmount).toFixed(2));

    const transactionId = `wallet_pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    user.walletBalance = (user.walletBalance || 0) - totalAmount;
    await this._userRepository.updateUser(user);

    const booking = new Booking(
      null,
      userId,
      eventId,
      seats || [],
      bookingType,
      totalAmount,
      commissionAmount,
      organizerRevenue,
      BookingStatus.CONFIRMED,
      transactionId,
    );

    const savedBooking = await this._bookingRepository.saveBooking(booking);

    if (bookingType === 'physical' && seats && seats.length > 0) {
      const layoutId = event.seatLayoutId;
      const layout = event.SeatLayout;

      for (const seatStr of seats) {
        const parts = seatStr.split('-');
        const block = parts[0] || 'Unknown';
        const row = parseInt(parts[1]) || 1;
        const column = parseInt(parts[2]) || 1;

        let price = event.price || 0;
        let categoryName = 'General';

        if (layout && layout.blocks) {
          const blockDetails = layout.blocks.find(
            (b: {
              blockName: string;
              category?: { price: number; name: string };
            }) =>
              b.blockName.trim().toUpperCase() === block.trim().toUpperCase(),
          );
          if (blockDetails) {
            price = blockDetails.category?.price ?? price;
            categoryName = blockDetails.category?.name ?? categoryName;
          }
        }

        await this._seatRepository.upsertSeat({
          eventId: eventId,
          layoutId: layoutId,
          block,
          row,
          column,
          seatNumber: seatStr,
          price,
          categoryName,
          status: SeatStatus.BOOKED,
        });
      }
    }

    const payment = new Payment(
      null,
      userId,
      PaymentPurpose.BOOKING,
      totalAmount,
      'INR',
      PaymentMethod.WALLET,
      PaymentStatus.SUCCESS,
      transactionId,
      eventId,
      savedBooking.id ?? '',
      new Date(),
    );

    await this._paymentRepository.savePayment(payment);

    return {
      success: true,
      message: 'Tickets booked successfully using wallet balance',
      bookingId: savedBooking.id,
    };
  }
}
