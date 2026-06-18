import { IUpdatePlanUseCase } from "./updateplan.usecase.interface";
import { CreatePlanDto } from "../../../dtos/createplan.dto";
import { ResponsePlanDto } from "../../../dtos/responses/responseplan.dto";
import { ISubscriptionRepository } from "../../../../domain/repositories/subscription/subscription.repository.interface";
import { IManagerSubscriptionRepository } from "../../../../domain/repositories/imanager-subscription.repository";

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository,
    private managerSubscriptionRepository: IManagerSubscriptionRepository
  )
   {}

  async execute(id: string, data: Partial<CreatePlanDto>): Promise<ResponsePlanDto | null> {
    const updatedPlan = await this.managerSubscriptionRepository.update(id, data as any);
    if (!updatedPlan) return null;
    return {
      id: updatedPlan.id!,
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
