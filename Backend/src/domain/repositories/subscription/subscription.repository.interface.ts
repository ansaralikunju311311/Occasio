
import { Subscription } from "../../entities/subscription.entity";

export interface ISubscriptionRepository {
  createPlan(data: Subscription): Promise<Subscription>;
  findAllPlans(): Promise<Subscription[]>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription | null>;
}
