import { IManagerSubscriptionRepository } from '../../../domain/repositories/imanager-subscription.repository';
import { ManagerSubscription } from '../../../domain/entities/manager-subscription.entity';
import { ManagerSubscriptionModel } from '../../database/model/manager-subscription.model';
import { PlanType } from '../../../common/enums/plan-enum';
import { ManagerPlan } from '../../../common/enums/manager-plan.enum';

export class ManagerSubscriptionRepository implements IManagerSubscriptionRepository {
  async create(subscription: ManagerSubscription, session?: any): Promise<ManagerSubscription> {
    const createdDocs = await ManagerSubscriptionModel.create([{
      userId: subscription.userId as any,
      plan: subscription.plan as unknown as PlanType,
      status: subscription.status,
      eventLimit: subscription.eventLimit,
      eventsUsed: subscription.eventsUsed,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    }], { session });

    return this.toEntity(createdDocs[0]);
  }

  async findById(id: string): Promise<ManagerSubscription | null> {
    const doc = await ManagerSubscriptionModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<ManagerSubscription[]> {
    const docs = await ManagerSubscriptionModel.find({ userId }).exec();
    return docs.map(doc => this.toEntity(doc));
  }

  async update(id: string, updateData: Partial<ManagerSubscription>, session?: any): Promise<ManagerSubscription | null> {
    const mappedUpdateData: any = { ...updateData };
    if (updateData.plan !== undefined) {
      mappedUpdateData.plan = updateData.plan as unknown as PlanType;
    }
    const doc = await ManagerSubscriptionModel.findByIdAndUpdate(id, mappedUpdateData, { new: true, session }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: any): ManagerSubscription {
    return new ManagerSubscription(
      doc._id.toString(),
      doc.userId.toString(),
      doc.plan as unknown as ManagerPlan,
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
