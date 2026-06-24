import type { PlanType } from '../../../common/enums/plan-enum';
export interface ResponsePlanDto {
  id: string;
  name: PlanType;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
