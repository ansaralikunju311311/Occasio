import type { ResponsePlanDto } from '../../application/dtos/responses/responseplan.dto';
import type { IPlanDocument } from '../../infrastructure/database/model/subscription/plan.model';

export const mapToResponsePlanDto = (
  plan:
    | IPlanDocument
    | {
        _id: { toString(): string } | string;
        name: string;
        price: number;
        eventLimit: number;
        commissionPercentage: number;
        features?: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
): ResponsePlanDto => {
  return {
    id: typeof plan._id === 'string' ? plan._id : plan._id.toString(),
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
