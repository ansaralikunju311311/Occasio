export interface IDeleteEventUseCase {
  execute(id: string): Promise<boolean>;
}
