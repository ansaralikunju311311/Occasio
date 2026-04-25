export interface ICreateOrderUseCase {
  execute(eventId: string, userId: string, amount?: number): Promise<any>;
}
