export interface IMyEventsUseCase {
  execute(userId: string, search?: string): Promise<any>;
}
