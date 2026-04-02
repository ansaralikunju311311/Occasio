import { UserController } from "../modules/auth/presentation/user/user.controller.js";
import { UpgradeUseCase } from "../modules/auth/application/use-cases/users/upgrade.usecase.js";
 import { UserRepository } from "../modules/auth/infrastructure/database/user/user.repository.js";
 import { ManagerRepository } from "../modules/auth/infrastructure/database/user/manager.repository.js";
 import { ReapplyUseCase } from "../modules/auth/application/use-cases/users/reapply.usecase.js";
 import { EditProfileUseCase } from "../modules/auth/application/use-cases/users/editProfileusecase.js";
export const makeUserController=()=>{
         const userRepository = new UserRepository();
        const eventManagerRepository = new ManagerRepository();



         const upgradeUseCase = new UpgradeUseCase(userRepository, eventManagerRepository);
         const reapplyUseCase = new ReapplyUseCase(userRepository);
         const editProfileUseCase = new EditProfileUseCase(userRepository)
    return new UserController(upgradeUseCase,
        reapplyUseCase,editProfileUseCase
    )
}