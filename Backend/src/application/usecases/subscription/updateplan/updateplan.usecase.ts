import type { CreatePlanDto } from '../../../dtos/createplan.dto';
import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';

import type { IUpdatePlanUseCase } from './updateplan.usecase.interface';

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async execute(
    id: string,
    data: Partial<CreatePlanDto>,
  ): Promise<ResponsePlanDto | null> {
    if (data.name) {
      const existingPlan = await this._subscriptionRepository.findPlanByName(
        data.name,
      );

      if (existingPlan && String(existingPlan.id) !== String(id)) {
        throw new AppError(
          'A subscription plan with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updatedPlan = await this._subscriptionRepository.update(id, data);
    if (!updatedPlan) {
      return null;
    }
    return {
      id: updatedPlan.id ?? '',
      name: updatedPlan.name,
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
