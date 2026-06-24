import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import { ManagerPlan } from '../../../../common/enums/manager-plan.enum';
import { UserResponseDto } from '../../../dtos/responses/user-response.dto';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { ISubscribeUseCase } from './subscribe.usecase.interface';

export class SubscribeUseCase implements ISubscribeUseCase {
  constructor(
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private managerSubscriptionRepository: IManagerSubscriptionRepository
  ) {}

  async execute(userId: string, planId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByIdUser(userId);
    if (!user) throw new Error('User not found');

    const plan = await this.subscriptionRepository.findPlanById(planId);
    if (!plan) throw new Error('Plan not found');

    if (plan.price > 0) {
      throw new Error('This plan requires payment. Please use the payment flow.');
    }

    if (user.activeSubscription) {
      const managerSub = await this.managerSubscriptionRepository.findById(user.activeSubscription);
      
      if (managerSub) {
        // Prevent downgrade by checking prices if necessary. Wait, we need the price of the current plan.
        const currentPlanDef = await this.subscriptionRepository.findPlanByName(managerSub.plan);
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

        await this.managerSubscriptionRepository.update(managerSub.id as string, {
          plan: managerSub.plan,
          eventLimit: managerSub.eventLimit,
          eventsUsed: managerSub.eventsUsed,
          startDate: managerSub.startDate,
          endDate: managerSub.endDate
        });
      }
    } else {
      // Create one if it doesn't exist (fallback)
      // This usually shouldn't happen as it's created during upgrade
      throw new Error('No active subscription found to upgrade.');
    }

    user.eventsCreated = 0; // Reset quota on new subscription

    const updatedUser = await this.userRepository.updateUser(user);
    return userMapper.toResponse(updatedUser);
  }
}
