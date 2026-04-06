export interface IGetEventsUseCase {
    execute(eventType: string): Promise<any>;
}
