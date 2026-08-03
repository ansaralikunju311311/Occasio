export interface WalletPayResultDto {
  success: boolean;
  message: string;
  bookingId: string | null;
}

export interface IWalletPayUseCase {
  execute(
    eventId: string,
    userId: string,
    amount: number,
    bookingType: 'physical' | 'online',
    seats?: string[],
  ): Promise<WalletPayResultDto>;
}
