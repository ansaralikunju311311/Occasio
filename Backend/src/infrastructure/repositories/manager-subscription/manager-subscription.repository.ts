import { IManagerSubscriptionRepository } from '../../../domain/repositories/imanager-subscription.repository';
import { ManagerSubscription } from '../../../domain/entities/manager-subscription.entity';
import { ManagerSubscriptionModel, IManagerSubscriptionDocument } from '../../database/model/manager-subscription.model';
import { BaseRepository } from '../base.repository';

export class ManagerSubscriptionRepository extends BaseRepository<IManagerSubscriptionDocument> implements IManagerSubscriptionRepository {
  constructor() {
    super(ManagerSubscriptionModel);
  }

  async create(subscription: ManagerSubscription, session?: any): Promise<ManagerSubscription> {
    const doc = await super.create({
      userId: subscription.userId as any,
      plan: subscription.plan,
      status: subscription.status,
      eventLimit: subscription.eventLimit,
      eventsUsed: subscription.eventsUsed,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    }, { session });

    return this.toEntity(doc);
  }

  async findById(id: string): Promise<ManagerSubscription | null> {
    const doc = await super.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<ManagerSubscription[]> {
    const docs = await super.findAll({ userId });
    return docs.map(doc => this.toEntity(doc));
  }

  async update(id: string, updateData: Partial<ManagerSubscription>, session?: any): Promise<ManagerSubscription | null> {
    const doc = await super.updateById(id, updateData, { session });
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: any): ManagerSubscription {
    return new ManagerSubscription(
      doc._id.toString(),
      doc.userId.toString(),
      doc.plan,
      doc.status,
      doc.eventLimit,
      doc.eventsUsed,
      doc.startDate,
      doc.endDate,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
