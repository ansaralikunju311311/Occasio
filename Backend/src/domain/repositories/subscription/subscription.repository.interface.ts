import type { Subscription } from '../../entities/subscription.entity';

export interface ISubscriptionRepository {
  createPlan(data: Subscription): Promise<Subscription>;
  findAllPlans(params?: { page?: number; limit?: number }): Promise<{ plans: Subscription[]; total: number }>;
  findPlanById(id: string): Promise<Subscription | null>;
  findPlanByName(name: string): Promise<Subscription | null>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription | null>;
}
