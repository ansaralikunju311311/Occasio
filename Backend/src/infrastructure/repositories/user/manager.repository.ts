import { EventManager } from '../../../domain/entities/manager.entity';
import { IEventManagerRepository } from '../../../domain/repositories/manger.repository.interface';
import { EventManagerModel } from '../../database/model/manager.model';
import { BaseRepository } from '../base.repository';
import { IEventManagerDocument } from '../../database/model/manager.model';
export class ManagerRepository
  extends BaseRepository<IEventManagerDocument>
  implements IEventManagerRepository
{
  constructor() {
    super(EventManagerModel);
  }
  async createManager(user: EventManager): Promise<EventManager> {
    const doc = await super.create({
      userId: user.userId,
      fullName: user.fullName,
      certificate: user.certificate,
      aboutEvents: user.aboutEvents,
      organizationType: user.organizationType,
      socialLinks: user.socialLinks,
      experienceLevel: user.experienceLevel,
      documentReference: user.documentReference,
      organizationName: user.organizationName,
    } as any);

    return this.toEntity(doc);
  }
  async findByIdManager(id: string): Promise<EventManager | null> {
    const manager = await super.findOne({ userId: id } as any);
    if (!manager) return null;
    return this.toEntity(manager);
  }
  private toEntity(doc: any): EventManager {
    return new EventManager(
      doc._id.toString(),
      doc.userId.toString(),
      doc.fullName,
      doc.organizationName,
      doc.aboutEvents,
      doc.certificate,
      doc.documentReference,
      doc.experienceLevel,
      doc.socialLinks,
      doc.organizationType,
    );
  }
}
