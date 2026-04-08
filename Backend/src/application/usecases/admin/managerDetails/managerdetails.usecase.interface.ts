import { EventManager } from '../../../../domain/entities/manager.entity';
export interface IManagerDetailsUseCase {
  execute(id: string, search?: string): Promise<EventManager | null>;
}
