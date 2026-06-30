import { Router } from 'express';

import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { makeAdminController } from '../../container/admin.containers';
import { UserRole } from '../../common/enums/userrole-enum';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const controller = makeAdminController();

router.get(
  ApiEndpoints.Admin.Users,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.getUsers.bind(controller),
);

router.patch(
  ApiEndpoints.Admin.BlockOrUnblock,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.userManage.bind(controller),
);

router.get(
  ApiEndpoints.Admin.UserDetails,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.userDetails.bind(controller),
);

router.get(
  ApiEndpoints.Admin.PendingManagers,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.pendingmanagerDetails.bind(controller),
);

router.patch(
  ApiEndpoints.Admin.Approval,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.managerApproval.bind(controller),
);

router.patch(
  ApiEndpoints.Admin.Rejection,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.managerRejection.bind(controller),
);

router.get(
  ApiEndpoints.Admin.ManagerDetails,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.managerDetails.bind(controller),
);

router.get(
  ApiEndpoints.Admin.Payments,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.getAllPayments.bind(controller),
);

router.get(
  ApiEndpoints.Admin.DashboardStats,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.getDashboardStats.bind(controller),
);

export default router;

