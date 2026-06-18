import { UpgradeUseCase } from '../application/usecases/user/upgraderole/upgradeRole.usecase';
import { ManagerRepository } from '../infrastructure/repositories/user/manager.repository';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription/subscription.repository';
import { UserController } from '../presentation/controllers/user.controller';
import { ReapplyUseCase } from '../application/usecases/user/reapply/reapply.usecase';
import { EditProfileUseCase } from '../application/usecases/user/editProfile/editprofile.usecase';
import { SubscribeUseCase } from '../application/usecases/user/subscribe/subscribe.usecase';
import { GetMySubscriptionUseCase } from '../application/usecases/user/getMySubscription/get-my-subscription.usecase';
import { ManagerSubscriptionRepository } from '../infrastructure/repositories/manager-subscription/manager-subscription.repository';

export const makeUserController = () => {
  const userRepository = new UserRepository();
  const managerRepository = new ManagerRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const managerSubscriptionRepository = new ManagerSubscriptionRepository();

  const upgradeUseCase = new UpgradeUseCase(userRepository, managerRepository);
  const reapplyUseCase = new ReapplyUseCase(userRepository);
  const editProfileUseCase = new EditProfileUseCase(userRepository);
  const subscribeUseCase = new SubscribeUseCase(userRepository, subscriptionRepository, managerSubscriptionRepository);
  const getMySubscriptionUseCase = new GetMySubscriptionUseCase(userRepository, managerSubscriptionRepository);

  return new UserController(upgradeUseCase, reapplyUseCase, editProfileUseCase, subscribeUseCase, getMySubscriptionUseCase);
};
