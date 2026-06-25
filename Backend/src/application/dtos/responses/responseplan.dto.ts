export interface ResponsePlanDto {
  id: string;
  name: string;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

