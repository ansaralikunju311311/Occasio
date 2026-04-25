import { PaymentController } from '../presentation/controllers/payment.controller';
import { RazorpayGateway } from '../infrastructure/services/payment/razorpay.gateway';
import { EventRepository } from '../infrastructure/repositories/event/event.repository';
import { CreateOrderUseCase } from '../application/usecases/payment/createOrder/createOrder.usecase';
import { VerifyPaymentUseCase } from '../application/usecases/payment/verifyPayment/verifyPayment.usecase';

export const MakePaymentController = () => {
  const paymentGateway = new RazorpayGateway();
  const eventRepository = new EventRepository();

  const createOrderUseCase = new CreateOrderUseCase(paymentGateway, eventRepository);
  const verifyPaymentUseCase = new VerifyPaymentUseCase(paymentGateway, eventRepository);

  return new PaymentController(createOrderUseCase, verifyPaymentUseCase);
};
