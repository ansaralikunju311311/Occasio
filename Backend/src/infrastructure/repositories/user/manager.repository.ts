import type { EventManager } from '../../../domain/entities/manager.entity';
import type { IEventManagerRepository } from '../../../domain/repositories/manger.repository.interface';
import { EventManagerModel } from '../../database/model/manager.model';
import { BaseRepository } from '../base.repository';
import type { IEventManagerDocument } from '../../database/model/manager.model';
import { managerMapper } from '../../../common/mappers/manager.mapper';

export class ManagerRepository
  extends BaseRepository<IEventManagerDocument>
  implements IEventManagerRepository
{
  constructor() {
    super(EventManagerModel);
  }
  async createManager(user: EventManager): Promise<EventManager> {
    const persistenceData = managerMapper.toPersistence(user);
    persistenceData.userId =
      persistenceData.userId as unknown as IEventManagerDocument['userId'];

    const doc = await super.create(
      persistenceData as Partial<IEventManagerDocument>,
    );

    return managerMapper.toDomain(doc as unknown as Record<string, unknown>);
  }
  async findByIdManager(id: string): Promise<EventManager | null> {
    const manager = await super.findOne({
      userId: id as unknown as IEventManagerDocument['userId'],
    });
    if (!manager) {
      return null;
    }
    return managerMapper.toDomain(
      manager as unknown as Record<string, unknown>,
    );
  }
}
