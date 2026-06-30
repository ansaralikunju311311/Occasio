import { PaymentController } from '../presentation/controllers/payment.controller';
import { RazorpayGateway } from '../infrastructure/services/payment/razorpay.gateway';
import { EventRepository } from '../infrastructure/repositories/event/event.repository';
import { CreateOrderUseCase } from '../application/usecases/payment/createOrder/createOrder.usecase';
import { VerifyPaymentUseCase } from '../application/usecases/payment/verifyPayment/verifyPayment.usecase';
import { PaymentRepository } from '../infrastructure/repositories/payment/payment.repository';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription/subscription.repository';
import { BookingRepository } from '../infrastructure/repositories/booking/booking.repository';
import { SeatRepository } from '../infrastructure/repositories/seatrepo/seat.repository';
import { GetBreakdownUseCase } from '../application/usecases/payment/getBreakdown/getBreakdown.usecase';
import { CreateSubscriptionOrderUseCase } from '../application/usecases/payment/createSubscriptionOrder/createSubscriptionOrder.usecase';
import { VerifySubscriptionPaymentUseCase } from '../application/usecases/payment/verifySubscriptionPayment/verifySubscriptionPayment.usecase';
import { ManagerSubscriptionRepository } from '../infrastructure/repositories/manager-subscription/manager-subscription.repository';
import { GetMyBookingUseCase } from '../application/usecases/booking/getMybookings/gertmybooking.usecase';
import { GetManagerBookingUseCase } from '../application/usecases/booking/getManagerbookings/getmanagerbooking.usecase';
import { WalletPayUseCase } from '../application/usecases/payment/walletPay/walletPay.usecase';

export const MakePaymentController = () => {
  const paymentGateway = new RazorpayGateway();
  const eventRepository = new EventRepository();
  const paymentRepository = new PaymentRepository();
  const userRepository = new UserRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const bookingRepository = new BookingRepository();
  const seatRepository = new SeatRepository();
  const managerSubscriptionRepository = new ManagerSubscriptionRepository();

  const getBreakdownUseCase = new GetBreakdownUseCase(
    eventRepository,
    userRepository,
    subscriptionRepository,
  );

  const createOrderUseCase = new CreateOrderUseCase(
    paymentGateway,
    eventRepository,
    userRepository,
    subscriptionRepository,
    bookingRepository,
  );

  const verifyPaymentUseCase = new VerifyPaymentUseCase(
    paymentGateway,
    eventRepository,
    paymentRepository,
    bookingRepository,
    seatRepository,
  );

  const createSubscriptionOrderUseCase = new CreateSubscriptionOrderUseCase(
    paymentGateway,
    userRepository,
    subscriptionRepository,
    managerSubscriptionRepository,
  );

  const verifySubscriptionPaymentUseCase = new VerifySubscriptionPaymentUseCase(
    paymentGateway,
    userRepository,
    paymentRepository,
    subscriptionRepository,
    managerSubscriptionRepository,
  );
  const getMybookingUseCase = new GetMyBookingUseCase(bookingRepository);
  const getManagerBookingUseCase = new GetManagerBookingUseCase(
    bookingRepository,
  );

  const walletPayUseCase = new WalletPayUseCase(
    eventRepository,
    userRepository,
    subscriptionRepository,
    bookingRepository,
    seatRepository,
    paymentRepository,
  );

  return new PaymentController(
    createOrderUseCase,
    verifyPaymentUseCase,
    getBreakdownUseCase,
    createSubscriptionOrderUseCase,
    verifySubscriptionPaymentUseCase,
    getMybookingUseCase,
    getManagerBookingUseCase,
    walletPayUseCase,
  );
};
