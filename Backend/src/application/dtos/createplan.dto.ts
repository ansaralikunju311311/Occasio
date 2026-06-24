import type { PlanType } from '../../common/enums/plan-enum';
export interface CreatePlanDto {
  name: PlanType;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features?: string[];
}
