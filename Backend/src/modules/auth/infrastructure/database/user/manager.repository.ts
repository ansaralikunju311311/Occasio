 import { EventManager } from "../../../domain/entites/manager.entity.js";
 import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";
 import { EventManagerModel } from "../event_manager.model.js";
import { BaseRepository } from "../../../../../common/repositories/base.repository.js";
import { IEventManagerDocument } from "../event_manager.model.js";
export class ManagerRepository
  extends BaseRepository<IEventManagerDocument>
  implements IEventManagerRepository {

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
      organizationName: user.organizationName
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
      doc.organizationType
    );
  }
}