import { ICreateOrderUseCase } from './createOrder.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import { Booking } from '../../../../domain/entities/booking.entity';
import { BookingStatus } from '../../../../infrastructure/database/model/booking.model';
import { SeatModel } from '../../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private bookingRepository: IBookingRepository
  ) {}

  async execute(
    eventId: string,
    userId: string,
    amount?: number,
    bookingType?: 'physical' | 'online',
    seats?: string[]
  ): Promise<any> {
    if (!amount) {
      // Event publishing fee flow (fixed amount 99)
      await this.eventRepository.validateOwnershipAndDraft(eventId, userId);
      return await this.paymentGateway.createOrder(eventId, 99);
    }

    // Ticket booking flow
    // 1. Fetch event to validate existence and ownership
    const event = await this.eventRepository.findByIdEvents(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.createdBy.toString() === userId.toString()) {
      throw new Error('You cannot book your own event.');
    }

    // 2. If physical booking, verify seats are not already booked in DB
    if (bookingType === 'physical' && seats && seats.length > 0) {
      const alreadyBooked = await SeatModel.find({
        eventId,
        seatNumber: { $in: seats },
        status: SeatStatus.BOOKED,
      });

      if (alreadyBooked.length > 0) {
        throw new Error(
          `Some seats are already booked: ${alreadyBooked.map((s) => s.seatNumber).join(', ')}`
        );
      }
    }

    const creator = await this.userRepository.findByIdUser(event.createdBy);
    let commissionPercentage = 10; // Default 10% if no active subscription

    if (creator && creator.activeSubscription) {
      const plan = await this.subscriptionRepository.findPlanById(creator.activeSubscription);
      if (plan) {
        commissionPercentage = plan.commissionPercentage;
      }
    }

    const commissionAmount = parseFloat((amount * (commissionPercentage / 100)).toFixed(2));
    const totalAmount = parseFloat((amount + commissionAmount).toFixed(2));
    const organizerRevenue = amount;

    // 3. Create Razorpay order
    const order = await this.paymentGateway.createOrder(eventId, totalAmount);

    // 4. Create pending booking record in the database
    const booking = new Booking(
      null,
      userId,
      eventId,
      seats || [],
      bookingType || 'physical',
      totalAmount,
      commissionAmount,
      organizerRevenue,
      BookingStatus.PENDING,
      order.id // Razorpay Order ID
    );

    await this.bookingRepository.saveBooking(booking);

    return order;
  }
}
