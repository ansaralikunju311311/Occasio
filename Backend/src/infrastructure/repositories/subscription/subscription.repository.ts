import { BaseRepository } from '../base.repository';
import type { IPlanDocument } from '../../database/model/subscription/plan.model';
import { SubscriptionModel } from '../../database/model/subscription/plan.model';
import type { ISubscriptionRepository } from '../../../domain/repositories/subscription/subscription.repository.interface';
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
      newPlan.updatedAt,
    );
  }

  async findAllPlans(params?: { page?: number; limit?: number }): Promise<{ plans: Subscription[]; total: number }> {
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
      plans: plans.map(
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
            plan.updatedAt,
          ),
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
    return new Subscription(
      plan._id as unknown as string,
      plan.name,
      plan.price,
      plan.eventLimit,
      plan.commissionPercentage,
      plan.features as [],
      plan.isActive,
      plan.createdAt,
      plan.updatedAt,
    );
  }

  async findPlanById(id: string): Promise<Subscription | null> {
    const plan = await this.model.findById(id);
    if (!plan) {
      return null;
    }
    return new Subscription(
      plan._id as unknown as string,
      plan.name,
      plan.price,
      plan.eventLimit,
      plan.commissionPercentage,
      plan.features as [],
      plan.isActive,
      plan.createdAt,
      plan.updatedAt,
    );
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
    return new Subscription(
      updatedPlan._id as unknown as string,
      updatedPlan.name,
      updatedPlan.price,
      updatedPlan.eventLimit,
      updatedPlan.commissionPercentage,
      updatedPlan.features as [],
      updatedPlan.isActive,
      updatedPlan.createdAt,
      updatedPlan.updatedAt,
    );
  }
}
