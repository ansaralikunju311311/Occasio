import { BaseRepository } from '../base.repository';
import type { IPlanDocument } from '../../database/model/subscription/plan.model';
import { SubscriptionModel } from '../../database/model/subscription/plan.model';
import type { ISubscriptionRepository } from '../../../domain/repositories/subscription/subscription.repository.interface';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { subscriptionMapper } from '../../../common/mappers/plan.mapper';
export class SubscriptionRepository
  extends BaseRepository<IPlanDocument>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel);
  }

  async createPlan(data: Subscription): Promise<Subscription> {
    const newPlan = await this.model.create(data);
    return subscriptionMapper.toDomain(newPlan.toObject() as unknown as Record<string, unknown>);
  }

  async findAllPlans(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ plans: Subscription[]; total: number }> {
    const page = params?.page;
    const limit = params?.limit;

    let plansQuery = this.model.find();
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      plansQuery = plansQuery.skip(skip).limit(limit);
    }

    const [plans, total] = await Promise.all([
      plansQuery.exec(),
      this.model.countDocuments().exec(),
    ]);

    return {
      plans: plans.map((plan) =>
        subscriptionMapper.toDomain(plan.toObject() as unknown as Record<string, unknown>),
      ),
      total,
    };
  }

  async findPlanByName(name: string): Promise<Subscription | null> {
    const plan = await this.model.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });
    if (!plan) {
      return null;
    }
    return subscriptionMapper.toDomain(plan.toObject() as unknown as Record<string, unknown>);
  }

  async findPlanById(id: string): Promise<Subscription | null> {
    const plan = await this.model.findById(id);
    if (!plan) {
      return null;
    }
    return subscriptionMapper.toDomain(plan.toObject() as unknown as Record<string, unknown>);
  }

  async update(
    id: string,
    data: Partial<Subscription>,
  ): Promise<Subscription | null> {
    const updatedPlan = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedPlan) {
      return null;
    }
    return subscriptionMapper.toDomain(updatedPlan.toObject() as unknown as Record<string, unknown>);
  }
}
