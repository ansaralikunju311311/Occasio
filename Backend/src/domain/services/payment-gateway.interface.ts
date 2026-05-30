export interface IPaymentGateway {
  createOrder(eventId: string, amount: number, notesType?: string): Promise<any>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}
