import { PaymentController } from '../presentation/controllers/payment.controller';
import { RazorpayGateway } from '../infrastructure/services/payment/razorpay.gateway';
import { EventRepository } from '../infrastructure/repositories/event/event.repository';
import { CreateOrderUseCase } from '../application/usecases/payment/createOrder/createOrder.usecase';
import { VerifyPaymentUseCase } from '../application/usecases/payment/verifyPayment/verifyPayment.usecase';
import { PaymentRepository } from '../infrastructure/repositories/payment/payment.repository';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription/subscription.repository';
import { BookingRepository } from '../infrastructure/repositories/booking/booking.repository';
import { GetBreakdownUseCase } from '../application/usecases/payment/getBreakdown/getBreakdown.usecase';

export const MakePaymentController = () => {
  const paymentGateway = new RazorpayGateway();
  const eventRepository = new EventRepository();
  const paymentRepository = new PaymentRepository();
  const userRepository = new UserRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const bookingRepository = new BookingRepository();

  const getBreakdownUseCase = new GetBreakdownUseCase(
    eventRepository,
    userRepository,
    subscriptionRepository
  );

  const createOrderUseCase = new CreateOrderUseCase(
    paymentGateway,
    eventRepository,
    userRepository,
    subscriptionRepository,
    bookingRepository
  );

  const verifyPaymentUseCase = new VerifyPaymentUseCase(
    paymentGateway,
    eventRepository,
    paymentRepository,
    bookingRepository
  );

  return new PaymentController(
    createOrderUseCase,
    verifyPaymentUseCase,
    getBreakdownUseCase,
    bookingRepository
  );
};
