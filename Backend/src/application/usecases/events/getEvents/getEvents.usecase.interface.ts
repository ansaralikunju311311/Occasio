export interface IGetEventsUseCase {
    execute(eventType: string,search:string): Promise<any>;
}
