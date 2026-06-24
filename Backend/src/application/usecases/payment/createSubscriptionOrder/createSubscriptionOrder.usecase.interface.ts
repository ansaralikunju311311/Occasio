export interface ICreateSubscriptionOrderUseCase {
  execute(userId: string, planId: string): Promise<unknown>;
}
