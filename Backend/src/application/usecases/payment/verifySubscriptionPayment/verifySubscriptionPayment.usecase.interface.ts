export interface IVerifySubscriptionPaymentUseCase {
  execute(
    data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planId: string;
    },
    userId: string,
  ): Promise<Record<string, unknown>>;
}
