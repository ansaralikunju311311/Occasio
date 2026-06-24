import type { Subscription } from '../../entities/subscription.entity';

export interface ISubscriptionRepository {
  createPlan(data: Subscription): Promise<Subscription>;
  findAllPlans(): Promise<Subscription[]>;
  findPlanById(id: string): Promise<Subscription | null>;
  findPlanByName(name: string): Promise<Subscription | null>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription | null>;
}
