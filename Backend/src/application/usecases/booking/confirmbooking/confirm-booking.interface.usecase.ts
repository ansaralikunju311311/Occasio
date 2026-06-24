export interface IConfirmBookingUseCase {
  execute(
    userId: string,
    eventId: string,
    seatIds: string[],
    paymentId: string,
    totalAmount: number,
    bookingType: 'physical' | 'online',
  ): Promise<Record<string, unknown>>;
}
