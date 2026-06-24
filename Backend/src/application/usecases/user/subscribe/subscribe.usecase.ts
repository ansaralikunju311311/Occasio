import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import type { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import type { ManagerPlan } from '../../../../common/enums/manager-plan.enum';
import type { UserResponseDto } from '../../../dtos/responses/user-response.dto';
import { userMapper } from '../../../../common/mappers/user.mapper';

import type { ISubscribeUseCase } from './subscribe.usecase.interface';

export class SubscribeUseCase implements ISubscribeUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _managerSubscriptionRepository: IManagerSubscriptionRepository,
  ) {}

  async execute(userId: string, planId: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findByIdUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this._subscriptionRepository.findPlanById(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    if (plan.price > 0) {
      throw new Error(
        'This plan requires payment. Please use the payment flow.',
      );
    }

    if (user.activeSubscription) {
      const managerSub = await this._managerSubscriptionRepository.findById(
        user.activeSubscription,
      );

      if (managerSub) {
        // Prevent downgrade by checking prices if necessary. Wait, we need the price of the current plan.
        const currentPlanDef =
          await this._subscriptionRepository.findPlanByName(managerSub.plan);
        if (currentPlanDef && plan.price < currentPlanDef.price) {
          throw new Error('You cannot downgrade to a lower tier plan.');
        }

        managerSub.plan = plan.name as unknown as ManagerPlan;
        managerSub.eventLimit = plan.eventLimit;
        managerSub.eventsUsed = 0;
        managerSub.startDate = new Date();
        const endDate = new Date(managerSub.startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        managerSub.endDate = endDate;

        await this._managerSubscriptionRepository.update(
          managerSub.id as string,
          {
            plan: managerSub.plan,
            eventLimit: managerSub.eventLimit,
            eventsUsed: managerSub.eventsUsed,
            startDate: managerSub.startDate,
            endDate: managerSub.endDate,
          },
        );
      }
    } else {
      // Create one if it doesn't exist (fallback)
      // This usually shouldn't happen as it's created during upgrade
      throw new Error('No active subscription found to upgrade.');
    }

    user.eventsCreated = 0; // Reset quota on new subscription

    const updatedUser = await this._userRepository.updateUser(user);
    return userMapper.toResponse(updatedUser);
  }
}
