import { ResponsePlanDto } from "../../application/dtos/responses/responseplan.dto";

export const mapToResponsePlanDto = (plan: any): ResponsePlanDto => {
  return {
    id: plan._id.toString(),
    name: plan.name,
    price: plan.price,
    eventLimit: plan.eventLimit,
    commissionPercentage: plan.commissionPercentage,
    features: plan.features || [],
    isActive: plan.isActive,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
};