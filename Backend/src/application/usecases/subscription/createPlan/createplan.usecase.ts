import type { CreatePlanDto } from '../../../dtos/createplan.dto';
import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { Subscription } from '../../../../domain/entities/subscription.entity';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';

import type { ICreatePlanUseCase } from './createplan.usecase.interface';
export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}
  async execute(data: CreatePlanDto): Promise<ResponsePlanDto | null> {
    const existingPlan = await this._subscriptionRepository.findPlanByName(data.name);
    if (existingPlan) {
      throw new AppError('A subscription plan with this name already exists', HttpStatus.CONFLICT);
    }

    const subscription = new Subscription(
      null,
      data.name,
      data.price,
      data.eventLimit,
      data.commissionPercentage,
      data.features || [],
      true,
    );

    const plan = await this._subscriptionRepository.createPlan(subscription);

    return {
      id: plan.id ?? '',
      name: plan.name,
      price: plan.price,
      eventLimit: plan.eventLimit,
      commissionPercentage: plan.commissionPercentage,
      features: plan.features,
      isActive: plan.isActive,
      createdAt: plan.createdAt as Date,
      updatedAt: plan.updatedAt as Date,
    };
  }
}
