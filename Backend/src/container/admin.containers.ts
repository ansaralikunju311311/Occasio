// import { UserRepository } from "../modules/auth/infrastructure/database/user.repository"
import { FindAllUseCase } from '../application/usecases/admin/allUsers/findall.usecase';
import { AdminController } from '../presentation/controllers/admin.controller';
import { AdminRepository } from '../infrastructure/repositories/admin/admin.repository';
import { UserManageUseCase } from '../application/usecases/admin/usermanage/usermanage.usecase';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { UserDetailsUseCase } from '../application/usecases/admin/userDetails/userdetails.usecase';
// import { ManagerRepository } from "../modules/auth/infrastructure/database/user/manager.repository"
import { ManagerApprovalUseCase } from '../application/usecases/admin/manageApproval/managerapproval.usecase';
import { PendingmanagerDetailsUseCase } from '../application/usecases/admin/pendingmanager/pendingmanager.usecase';
import { ManagerRejectionUseCase } from '../application/usecases/admin/managerRejection/managerRejection.usecase';
import { EmailSerive } from '../common/services/email.service';
import { ManagerRepository } from '../infrastructure/repositories/user/manager.repository';
import { ManagerDetailsUseCase } from '../application/usecases/admin/managerDetails/managerdetails.usecase';
import { ManagerSubscriptionRepository } from '../infrastructure/repositories/manager-subscription/manager-subscription.repository';
import { PaymentRepository } from '../infrastructure/repositories/payment/payment.repository';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription/subscription.repository';
import { GetAllPaymentsUseCase } from '../application/usecases/payment/getAllPayments/getAllPayments.usecase';

export const makeAdminController = () => {
  const adminRepository = new AdminRepository();
  const userRepository = new UserRepository();
  const emailService = new EmailSerive();
  const managerRepository = new ManagerRepository();
  const paymentRepository = new PaymentRepository();
  const managerSubscriptionRepository = new ManagerSubscriptionRepository();
  const subscriptionRepository = new SubscriptionRepository();
  

  const findAllUseCase = new FindAllUseCase(adminRepository);
  const userManageUseCase = new UserManageUseCase(userRepository);
  const userDetailsUseCase = new UserDetailsUseCase(userRepository);
  const pendingmanagerDetailsUseCase = new PendingmanagerDetailsUseCase(
    adminRepository,
  );
  const managerApprovalUseCase = new ManagerApprovalUseCase(
    userRepository,
    emailService,
    managerSubscriptionRepository,
    subscriptionRepository,
  );
  const managerRejectionUseCase = new ManagerRejectionUseCase(
    userRepository,
    emailService,
  );
  const managerDetailsUseCase = new ManagerDetailsUseCase(managerRepository);
  const getAllPaymentsUseCase = new GetAllPaymentsUseCase(paymentRepository);

  return new AdminController(
    findAllUseCase,
    userManageUseCase,
    userDetailsUseCase,
    pendingmanagerDetailsUseCase,
    managerApprovalUseCase,
    managerRejectionUseCase,
    managerDetailsUseCase,
    getAllPaymentsUseCase,
  );
};
