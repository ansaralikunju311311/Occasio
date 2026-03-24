// import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js"
import { FindAllUseCase} from "../modules/auth/application/use-cases/admin/findall.usecase.js"
import { AdminController } from "../modules/auth/presentation/admin.controller.js"
import { AdminRepository } from "../modules/auth/infrastructure/database/admin-user.repository.js"
import { UserManageUseCase } from "../modules/auth/application/use-cases/admin/usermange.usecase.js"
import { UserRepository } from "../modules/auth/infrastructure/database/user/user.repository.js"
import { UserDetailsUseCase } from "../modules/auth/application/use-cases/admin/userdetails.usecase.js"
// import { ManagerRepository } from "../modules/auth/infrastructure/database/user/manager.repository.js"
import { ManagerApprovalUseCase } from "../modules/auth/application/use-cases/admin/managerapproval.usecase.js"
 import { PendingmanagerDetailsUseCase } from "../modules/auth/application/use-cases/admin/pendingmanager.usecase.js"
 import { ManagerRejectionUseCase } from "../modules/auth/application/use-cases/admin/managerrejection.usecase.js"
import { EmailSerive } from "../common/service/email.service.js"
export const makeAdminController=()=>{
     const adminRepository = new AdminRepository;
     const userRepository = new UserRepository;
     const emailService = new EmailSerive;
     // const managerRespository = new ManagerRepository


     const  findAllUseCase = new FindAllUseCase(adminRepository);
     const  userManageUseCase = new UserManageUseCase(userRepository);
const userDetailsUseCase= new UserDetailsUseCase(userRepository);
const pendingmanagerDetailsUseCase = new PendingmanagerDetailsUseCase(adminRepository)
const managerApprovalUseCase = new ManagerApprovalUseCase(userRepository, emailService);
 const managerRejectionUseCase=new ManagerRejectionUseCase(userRepository, emailService)


     return new AdminController(findAllUseCase,userManageUseCase,userDetailsUseCase,pendingmanagerDetailsUseCase,managerApprovalUseCase,managerRejectionUseCase
     )
}