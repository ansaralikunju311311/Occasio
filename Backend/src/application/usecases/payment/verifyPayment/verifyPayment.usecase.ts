import { IVerifyPaymentUseCase } from './verifyPayment.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import { Payment } from '../../../../domain/entities/payment.entity';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private eventRepository: IEventRepository,
    private paymentRepository: IPaymentRepository
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

    // Save payment details
    const payment = new Payment(
      null,
      userId,
      PaymentPurpose.EVENT_PUBLISH,
      99, // default fixed price for publishing an event
      'INR',
      PaymentMethod.RAZORPAY,
      PaymentStatus.SUCCESS,
      razorpay_payment_id,
      eventId,
      undefined,
      new Date(),
      undefined,
      undefined
    );

    await this.paymentRepository.savePayment(payment);

    return {
      success: true,
      message: 'Payment verified and event published successfully',
    };
  }
}
