export interface ICreateOrderUseCase {
  execute(
    eventId: string,
    userId: string,
    amount?: number,
    bookingType?: 'physical' | 'online',
    seats?: string[],
  ): Promise<unknown>;
}
