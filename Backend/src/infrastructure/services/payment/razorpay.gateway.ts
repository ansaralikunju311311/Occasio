import crypto from 'crypto';

import type { IPaymentGateway } from '../../../domain/services/payment-gateway.interface';
import { razorpayInstance } from '../../config/razorpay';
import { logger } from '../../../common/logger/logger';

export class RazorpayGateway implements IPaymentGateway {
  async createOrder(
    eventId: string,
    amount: number,
    notesType: string = 'scheduling_fee',
  ) {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_event_${eventId}`,
      notes: {
        referenceId: eventId,
        type: notesType,
      },
    };

    try {
      const order = await razorpayInstance.orders.create(options);
      return order;
    } catch (error) {
      logger.error('Error creating Razorpay order:', error);
      throw new Error('Could not create payment order');
    }
  }

  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    const text = orderId + '|' + paymentId;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  }

  async refund(transactionId: string, amount: number): Promise<void> {
    try {
      await razorpayInstance.payments.refund(transactionId, {
        amount: amount * 100,
      });
      logger.info(
        `Successfully refunded transaction ${transactionId} via Razorpay`,
      );
    } catch (error) {
      logger.error(
        `Razorpay refund API call failed for transaction ${transactionId}:`,
        error,
      );
      throw error;
    }
  }
}
