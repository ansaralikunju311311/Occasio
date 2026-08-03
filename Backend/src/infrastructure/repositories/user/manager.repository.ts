import type mongoose from 'mongoose';

import { EventManager } from '../../../domain/entities/manager.entity';
import type { IEventManagerRepository } from '../../../domain/repositories/manger.repository.interface';
import { EventManagerModel } from '../../database/model/manager.model';
import { BaseRepository } from '../base.repository';
import type { IEventManagerDocument } from '../../database/model/manager.model';

export class ManagerRepository
  extends BaseRepository<IEventManagerDocument>
  implements IEventManagerRepository
{
  constructor() {
    super(EventManagerModel);
  }
  async createManager(user: EventManager): Promise<EventManager> {
    const doc = await super.create({
      userId: user.userId as unknown as IEventManagerDocument['userId'],
      fullName: user.fullName,
      certificate: user.certificate,
      aboutEvents: user.aboutEvents,
      organizationType: user.organizationType,
      socialLinks: user.socialLinks,
      experienceLevel: user.experienceLevel,
      documentReference: user.documentReference,
      organizationName: user.organizationName,
    });

    return this.toEntity(doc);
  }
  async findByIdManager(id: string): Promise<EventManager | null> {
    const manager = await super.findOne({
      userId: id as unknown as IEventManagerDocument['userId'],
    });
    if (!manager) {
      return null;
    }
    return this.toEntity(manager);
  }
  private toEntity(
    doc:
      | IEventManagerDocument
      | mongoose.HydratedDocument<IEventManagerDocument>
      | Record<string, unknown>,
  ): EventManager {
    const d = doc as Record<string, unknown>;
    return new EventManager(
      (d._id as mongoose.Types.ObjectId)?.toString() || (d.id as string) || '',
      (d.userId as mongoose.Types.ObjectId)?.toString() ||
        String(d.userId || ''),
      (d.fullName as string) || '',
      (d.organizationName as string) || '',
      (d.aboutEvents as string) || '',
      (d.certificate as string) || '',
      (d.documentReference as string) || '',
      (d.experienceLevel as string) || '',
      (d.socialLinks as string) || '',
      (d.organizationType as string) || '',
    );
  }
}
