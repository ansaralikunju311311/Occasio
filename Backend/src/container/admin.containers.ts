// import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js"
import { FindAllUseCase } from '../application/usecases/admin/allUsers/findall.usecase';
import { AdminController } from '../presentation/controllers/admin.controller';
import { AdminRepository } from '../infrastructure/repositories/admin/admin.repository';
import { UserManageUseCase } from '../application/usecases/admin/usermanage/usermanage.usecase';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { UserDetailsUseCase } from '../application/usecases/admin/userDetails/userdetails.usecase';
// import { ManagerRepository } from "../modules/auth/infrastructure/database/user/manager.repository.js"
import { ManagerApprovalUseCase } from '../application/usecases/admin/manageApproval/managerapproval.usecase';
import { PendingmanagerDetailsUseCase } from '../application/usecases/admin/pendingmanager/pendingmanager.usecase';
import { ManagerRejectionUseCase } from '../application/usecases/admin/managerRejection/managerRejection.usecase';
import { EmailSerive } from '../common/services/email.service';
import { ManagerRepository } from '../infrastructure/repositories/user/manager.repository';
import { ManagerDetailsUseCase } from '../application/usecases/admin/managerDetails/managerdetails.usecase';
export const makeAdminController = () => {
  const adminRepository = new AdminRepository();
  const userRepository = new UserRepository();
  const emailService = new EmailSerive();
  const managerRepository = new ManagerRepository();
  // const managerRespository = new ManagerRepository

  const findAllUseCase = new FindAllUseCase(adminRepository);
  const userManageUseCase = new UserManageUseCase(userRepository);
  const userDetailsUseCase = new UserDetailsUseCase(userRepository);
  const pendingmanagerDetailsUseCase = new PendingmanagerDetailsUseCase(
    adminRepository,
  );
  const managerApprovalUseCase = new ManagerApprovalUseCase(
    userRepository,
    emailService,
  );
  const managerRejectionUseCase = new ManagerRejectionUseCase(
    userRepository,
    emailService,
  );
  const managerDetailsUseCase = new ManagerDetailsUseCase(managerRepository);

  return new AdminController(
    findAllUseCase,
    userManageUseCase,
    userDetailsUseCase,
    pendingmanagerDetailsUseCase,
    managerApprovalUseCase,
    managerRejectionUseCase,
    managerDetailsUseCase,
  );
};
