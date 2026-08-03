import type mongoose from 'mongoose';
import type { ManagerSubscription } from '../entities/manager-subscription.entity';

export interface IManagerSubscriptionRepository {
  create(
    subscription: ManagerSubscription,
    session?: mongoose.ClientSession,
  ): Promise<ManagerSubscription>;
  findById(id: string): Promise<ManagerSubscription | null>;
  findByUserId(userId: string): Promise<ManagerSubscription[]>;
  update(
    id: string,
    updateData: Partial<ManagerSubscription>,
    session?: mongoose.ClientSession,
  ): Promise<ManagerSubscription | null>;
}
