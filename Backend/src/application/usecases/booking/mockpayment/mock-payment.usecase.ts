import type {
  IMockPaymentUseCase,
  PaymentIntentResponse,
} from './mock-payment.usecase.interface';

export class MockPaymentUseCase implements IMockPaymentUseCase {
  async createPaymentIntent(
    userId: string,
    eventId: string,
    amount: number,
  ): Promise<PaymentIntentResponse> {
    const mockClientSecret = `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    const mockPaymentId = `mock_pay_${Date.now()}`;

    return {
      clientSecret: mockClientSecret,
      paymentId: mockPaymentId,
      amount,
    };
  }
}
