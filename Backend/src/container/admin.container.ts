// import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js"
import { FindAllUseCase} from "../modules/auth/application/use-cases/admin/findall.usecase.js"
import { AdminController } from "../modules/auth/presentation/admin.controller.js"
import { AdminRepository } from "../modules/auth/infrastructure/database/admin-user.repository.js"
export const makeAdminController=()=>{
     const userRepository = new AdminRepository



     const  findAllUseCase = new FindAllUseCase(userRepository);

     return new AdminController(findAllUseCase)
}