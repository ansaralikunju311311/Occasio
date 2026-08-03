import type { ResponsePlanDto } from '../../application/dtos/responses/responseplan.dto';
import type { Subscription } from '../../domain/entities/subscription.entity';

export const mapToResponsePlanDto = (
  plan: Subscription,
): ResponsePlanDto => {
  return {
    id: plan.id ?? '',
    name: plan.name,
    price: plan.price,
    eventLimit: plan.eventLimit,
    commissionPercentage: plan.commissionPercentage,
    features: plan.features || [],
    isActive: plan.isActive,
    createdAt: plan.createdAt || new Date(),
    updatedAt: plan.updatedAt || new Date(),
  };
};
