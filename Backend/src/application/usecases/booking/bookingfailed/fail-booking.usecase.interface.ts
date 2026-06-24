export interface IFailBookingUseCase {
  execute(userId: string, seatIds: string[]): Promise<number>;
}
