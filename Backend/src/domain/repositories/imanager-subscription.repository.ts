import type { IDbSession } from '../services/transaction-manager.interface';
import type { ManagerSubscription } from '../entities/manager-subscription.entity';

export interface IManagerSubscriptionRepository {
  create(
    subscription: ManagerSubscription,
    session?: IDbSession,
  ): Promise<ManagerSubscription>;
  findById(id: string): Promise<ManagerSubscription | null>;
  findByUserId(userId: string): Promise<ManagerSubscription[]>;
  update(
    id: string,
    updateData: Partial<ManagerSubscription>,
    session?: IDbSession,
  ): Promise<ManagerSubscription | null>;
}
