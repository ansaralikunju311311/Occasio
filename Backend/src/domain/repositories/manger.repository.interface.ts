import type { EventManager } from '../entities/manager.entity';

export interface IEventManagerRepository {
  createManager(user: EventManager): Promise<EventManager>;

  findByIdManager(id: string): Promise<EventManager | null>;
}
