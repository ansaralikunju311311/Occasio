import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
// import { IManagerSubscriptionRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import { ManagerSubscription } from '../../../../domain/entities/manager-subscription.entity';
import { IGetMySubscriptionUseCase } from './get-mysub.usecase.interface';

export class GetMySubscriptionUseCase implements IGetMySubscriptionUseCase{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly managerSubscriptionRepository: IManagerSubscriptionRepository
  ) {}

  async execute(userId: string): Promise<ManagerSubscription | null> {
    const user = await this.userRepository.findByIdUser(userId);
    if (!user || !user.activeSubscription) {
      return null;
    }

    const subscription = await this.managerSubscriptionRepository.findById(user.activeSubscription);
    return subscription;
  }
}
