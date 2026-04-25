import { IVerifyPaymentUseCase } from './verifyPayment.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private eventRepository: IEventRepository
  ) {}

  async execute(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    eventId: string;
  }, userId: string): Promise<any> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = data;

    // Verify signature
    const isValid = this.paymentGateway.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // Update event to LIVE
    await this.eventRepository.publishEvent(eventId);

    return {
      success: true,
      message: 'Payment verified and event published successfully',
    };
  }
}
