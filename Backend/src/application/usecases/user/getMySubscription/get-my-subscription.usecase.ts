import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import type { ManagerSubscription } from '../../../../domain/entities/manager-subscription.entity';

import type { IGetMySubscriptionUseCase } from './get-mysub.usecase.interface';

export class GetMySubscriptionUseCase implements IGetMySubscriptionUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _managerSubscriptionRepository: IManagerSubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<ManagerSubscription | null> {
    const user = await this._userRepository.findByIdUser(userId);
    if (!user || !user.activeSubscription) {
      return null;
    }

    const subscription = await this._managerSubscriptionRepository.findById(
      user.activeSubscription,
    );
    return subscription;
  }
}
