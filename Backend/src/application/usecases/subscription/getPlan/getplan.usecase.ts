import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';

import type { IGetPlansUseCase } from './getplan.usecase.interface';

export class GetPlansUseCase implements IGetPlansUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async execute(): Promise<ResponsePlanDto[]> {
    const plans = await this._subscriptionRepository.findAllPlans();
    return plans.map((plan) => ({
      id: plan.id ?? '',
      name: plan.name,
      price: plan.price,
      eventLimit: plan.eventLimit,
      commissionPercentage: plan.commissionPercentage,
      features: plan.features,
      isActive: plan.isActive,
      createdAt: plan.createdAt as Date,
      updatedAt: plan.updatedAt as Date,
    }));
  }
}
