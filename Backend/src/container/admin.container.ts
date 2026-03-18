// import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js"
import { FindAllUseCase} from "../modules/auth/application/use-cases/admin/findall.usecase.js"
import { AdminController } from "../modules/auth/presentation/admin.controller.js"
import { AdminRepository } from "../modules/auth/infrastructure/database/admin-user.repository.js"
import { UserManageUseCase } from "../modules/auth/application/use-cases/admin/usermange.usecase.js"
import { UserRepository } from "../modules/auth/infrastructure/database/user/user.repository.js"
export const makeAdminController=()=>{
     const adminRepository = new AdminRepository;
     const userRepository = new UserRepository



     const  findAllUseCase = new FindAllUseCase(adminRepository);
     const  userManageUseCase = new UserManageUseCase(userRepository)

     return new AdminController(findAllUseCase,userManageUseCase)
}