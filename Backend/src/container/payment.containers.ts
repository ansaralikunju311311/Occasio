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
import { CreateSubscriptionOrderUseCase } from '../application/usecases/payment/createSubscriptionOrder/createSubscriptionOrder.usecase';
import { VerifySubscriptionPaymentUseCase } from '../application/usecases/payment/verifySubscriptionPayment/verifySubscriptionPayment.usecase';
import { ManagerSubscriptionRepository } from '../infrastructure/repositories/manager-subscription/manager-subscription.repository';

export const MakePaymentController = () => {
  const paymentGateway = new RazorpayGateway();
  const eventRepository = new EventRepository();
  const paymentRepository = new PaymentRepository();
  const userRepository = new UserRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const bookingRepository = new BookingRepository();
  const managerSubscriptionRepository = new ManagerSubscriptionRepository();

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

  const createSubscriptionOrderUseCase = new CreateSubscriptionOrderUseCase(
    paymentGateway,
    userRepository,
    subscriptionRepository,
    managerSubscriptionRepository
  );

  const verifySubscriptionPaymentUseCase = new VerifySubscriptionPaymentUseCase(
    paymentGateway,
    userRepository,
    paymentRepository,
    subscriptionRepository,
    managerSubscriptionRepository
  );

  return new PaymentController(
    createOrderUseCase,
    verifyPaymentUseCase,
    getBreakdownUseCase,
    bookingRepository,
    createSubscriptionOrderUseCase,
    verifySubscriptionPaymentUseCase
  );
};

