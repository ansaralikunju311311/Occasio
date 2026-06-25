export interface CreatePlanDto {
  name: string;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features?: string[];
}

