import { UserController } from "../modules/auth/presentation/user/user.controller.js";
import { UpgradeUseCase } from "../modules/auth/application/use-cases/users/upgrade.usecase.js";
import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js";
export const makeUserController=()=>{
         const userRepository = new UserRepository



         const upgradeUseCase = new UpgradeUseCase(userRepository)
    return new UserController(upgradeUseCase)
}