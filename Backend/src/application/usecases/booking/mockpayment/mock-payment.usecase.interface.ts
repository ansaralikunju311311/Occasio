export interface IMockPaymentUseCase {
  createPaymentIntent(
    userId: string,
    eventId: string,
    amount: number,
  ): Promise<PaymentIntentResponse>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
  amount: number;
}
