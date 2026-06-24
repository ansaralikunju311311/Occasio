import type { CreatePlanDto } from '../../../dtos/createplan.dto';
import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import type { PlanType } from '../../../../common/enums/plan-enum';

import type { IUpdatePlanUseCase } from './updateplan.usecase.interface';

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async execute(
    id: string,
    data: Partial<CreatePlanDto>,
  ): Promise<ResponsePlanDto | null> {
    const updatedPlan = await this._subscriptionRepository.update(id, data);
    if (!updatedPlan) {
      return null;
    }
    return {
      id: updatedPlan.id ?? '',
      name: updatedPlan.name as PlanType,
      price: updatedPlan.price,
      eventLimit: updatedPlan.eventLimit,
      commissionPercentage: updatedPlan.commissionPercentage,
      features: updatedPlan.features,
      isActive: updatedPlan.isActive,
      createdAt: updatedPlan.createdAt as Date,
      updatedAt: updatedPlan.updatedAt as Date,
    };
  }
}
