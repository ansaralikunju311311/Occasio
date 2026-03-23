import { UserController } from "../modules/auth/presentation/user/user.controller.js";
import { UpgradeUseCase } from "../modules/auth/application/use-cases/users/upgrade.usecase.js";
import { UserRepository } from "../modules/auth/infrastructure/database/user/user.repository.js";
import { ManagerRepository } from "../modules/auth/infrastructure/database/user/manager.repository.js";

export const makeUserController=()=>{
         const userRepository = new UserRepository();
         const eventManagerRepository = new ManagerRepository();



         const upgradeUseCase = new UpgradeUseCase(userRepository, eventManagerRepository)
    return new UserController(upgradeUseCase)
}