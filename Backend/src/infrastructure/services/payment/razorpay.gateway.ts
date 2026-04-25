import { IPaymentGateway } from '../../../domain/services/payment-gateway.interface';
import { razorpayInstance } from '../../config/razorpay';
import crypto from 'crypto';

export class RazorpayGateway implements IPaymentGateway {
  /**
   * Create a Razorpay order for an event fee
   */
  async createOrder(eventId: string, amount: number) {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_event_${eventId}`,
      notes: {
        eventId: eventId,
        type: 'scheduling_fee',
      },
    };

    try {
      const order = await razorpayInstance.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Could not create payment order');
    }
  }

  /**
   * Verify the Razorpay payment signature
   */
  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const text = orderId + '|' + paymentId;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  }
}
