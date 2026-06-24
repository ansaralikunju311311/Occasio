export interface IPaymentGateway {
  createOrder(
    eventId: string,
    amount: number,
    notesType?: string,
  ): Promise<unknown>;
  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean;
}
