export interface IPaymentGateway {
  createOrder(eventId: string, amount: number): Promise<any>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}
