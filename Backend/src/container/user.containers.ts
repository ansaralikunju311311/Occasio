import { UpgradeUseCase } from '../application/usecases/user/upgraderole/upgradeRole.usecase';
import { ManagerRepository } from '../infrastructure/repositories/user/manager.repository';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { UserController } from '../presentation/controllers/user.controller';
import { ReapplyUseCase } from '../application/usecases/user/reapply/reapply.usecase';
import { EditProfileUseCase } from '../application/usecases/user/editProfile/editprofile.usecase';
export const makeUserController = () => {
  const userRepository = new UserRepository();
  const managerRepository = new ManagerRepository();

  const upgradeUseCase = new UpgradeUseCase(userRepository, managerRepository);
  const reapplyUseCase = new ReapplyUseCase(userRepository);
  const editProfileUseCase = new EditProfileUseCase(userRepository);

  return new UserController(upgradeUseCase, reapplyUseCase, editProfileUseCase);
};
