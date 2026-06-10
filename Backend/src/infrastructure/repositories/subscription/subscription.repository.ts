import { BaseRepository } from '../base.repository';
import { IPlanDocument, SubscriptionModel } from '../../database/model/subscription/plan.model';
import { ISubscriptionRepository } from '../../../domain/repositories/subscription/subscription.repository.interface';
import { Subscription } from '../../../domain/entities/subscription.entity';
export class SubscriptionRepository
  extends BaseRepository<IPlanDocument>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel);
  }

  async createPlan(data: Subscription): Promise<Subscription> {
    const newPlan = await this.model.create(data);
    return new Subscription(
      newPlan._id as unknown as string,
      newPlan.name,
      newPlan.price,
      newPlan.eventLimit,
      newPlan.commissionPercentage,
      newPlan.features as [],
      newPlan.isActive,
      newPlan.createdAt,
      newPlan.updatedAt
    );
  }

  async findAllPlans(): Promise<Subscription[]> {
    const plans = await this.model.find();
    return plans.map(
      (plan) =>
        new Subscription(
          plan._id as unknown as string,
          plan.name,
          plan.price,
          plan.eventLimit,
          plan.commissionPercentage,
          plan.features as [],
          plan.isActive,
          plan.createdAt,
          plan.updatedAt
        )
    );
  }

  async findPlanByName(name: string): Promise<Subscription | null> {
    const plan = await this.model.findOne({ name });
    if (!plan) return null;
    return new Subscription(
      plan._id as unknown as string,
      plan.name,
      plan.price,
      plan.eventLimit,
      plan.commissionPercentage,
      plan.features as [],
      plan.isActive,
      plan.createdAt,
      plan.updatedAt
    );
  }

  async findPlanById(id: string): Promise<Subscription | null> {
    const plan = await this.model.findById(id);
    if (!plan) return null;
    return new Subscription(
      plan._id as unknown as string,
      plan.name,
      plan.price,
      plan.eventLimit,
      plan.commissionPercentage,
      plan.features as [],
      plan.isActive,
      plan.createdAt,
      plan.updatedAt
    );
  }

  async update(id: string, data: Partial<Subscription>): Promise<Subscription | null> {
    const updatedPlan = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPlan) return null;
    return new Subscription(
      updatedPlan._id as unknown as string,
      updatedPlan.name,
      updatedPlan.price,
      updatedPlan.eventLimit,
      updatedPlan.commissionPercentage,
      updatedPlan.features as [],
      updatedPlan.isActive,
      updatedPlan.createdAt,
      updatedPlan.updatedAt
    );
  }
}
