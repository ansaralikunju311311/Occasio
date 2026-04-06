export interface IMyEventsUseCase {
    execute(userId: string): Promise<any>;
}
