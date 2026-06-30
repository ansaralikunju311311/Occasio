export interface IWalletPayUseCase {
  execute(
    eventId: string,
    userId: string,
    amount: number,
    bookingType: 'physical' | 'online',
    seats?: string[],
  ): Promise<any>;
}
