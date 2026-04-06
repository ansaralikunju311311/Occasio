export interface IEventDetailsUseCase {
    execute(id: string): Promise<any>;
}
