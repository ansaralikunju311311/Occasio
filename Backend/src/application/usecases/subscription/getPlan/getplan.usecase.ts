import { IGetPlansUseCase } from "./getplan.usecase.interface";
import { ResponsePlanDto } from "../../../dtos/responses/responseplan.dto";
import { ISubscriptionRepository } from "../../../../domain/repositories/subscription/subscription.repository.interface";

export class GetPlansUseCase implements IGetPlansUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(): Promise<ResponsePlanDto[]> {
    const plans = await this.subscriptionRepository.findAllPlans();
    return plans.map((plan) => ({
      id: plan.id!,
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
