export interface IVerifyPaymentUseCase {
  execute(
    data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      eventId: string;
    },
    userId: string,
  ): Promise<Record<string, unknown>>;
}
