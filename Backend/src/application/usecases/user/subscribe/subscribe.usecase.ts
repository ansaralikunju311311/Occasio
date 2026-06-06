import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { UserResponseDto } from '../../../dtos/responses/user-response.dto';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { ISubscribeUseCase } from './subscribe.usecase.interface';

export class SubscribeUseCase implements ISubscribeUseCase {
  constructor(
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository
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
      const currentPlan = await this.subscriptionRepository.findPlanById(user.activeSubscription);
      if (currentPlan && plan.price < currentPlan.price) {
        throw new Error('You cannot downgrade to a lower tier plan.');
      }
    }

    user.activeSubscription = plan.id?.toString();
    user.eventsCreated = 0; // Reset quota on new subscription

    const updatedUser = await this.userRepository.updateUser(user);
    return userMapper.toResponse(updatedUser);
  }
}
