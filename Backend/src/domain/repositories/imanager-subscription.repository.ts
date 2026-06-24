/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ManagerSubscription } from '../entities/manager-subscription.entity';

export interface IManagerSubscriptionRepository {
  create(
    subscription: ManagerSubscription,
    session?: any,
  ): Promise<ManagerSubscription>;
  findById(id: string): Promise<ManagerSubscription | null>;
  findByUserId(userId: string): Promise<ManagerSubscription[]>;
  update(
    id: string,
    updateData: Partial<ManagerSubscription>,
    session?: any,
  ): Promise<ManagerSubscription | null>;
}
