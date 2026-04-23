import { ICreatePlanUseCase } from "./createplan.usecase.interface";
import { CreatePlanDto } from "../../../dtos/createplan.dto";
import { ResponsePlanDto } from "../../../dtos/responses/responseplan.dto";
import { ISubscriptionRepository } from "../../../../domain/repositories/subscription/subscription.repository.interface";
export class CreatePlanUseCase implements ICreatePlanUseCase{


    constructor(
        private subscriptionRepository :ISubscriptionRepository
    ){}
    async execute(data: CreatePlanDto): Promise<ResponsePlanDto | null> {
        
       const plan = await this.subscriptionRepository.createPlan(data as any);

       return {
         id: plan.id!,
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