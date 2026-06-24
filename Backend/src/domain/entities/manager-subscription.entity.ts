import type { ManagerPlan } from '../../common/enums/manager-plan.enum';
import type { ManagerSubscriptionStatus } from '../../common/enums/manager-subscription-status.enum';

export class ManagerSubscription {
  constructor(
    public readonly id: string | null,
    public userId: string,
    public plan: ManagerPlan,
    public status: ManagerSubscriptionStatus,
    public eventLimit: number,
    public eventsUsed: number,
    public startDate: Date,
    public endDate?: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
