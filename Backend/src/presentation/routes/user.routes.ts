import { Router } from 'express';

import { verifyAccessToken } from '../../presentation/middlewares/verifyAccessToken.middleware';
import { makeUserController } from '../../container/user.containers';
import { requireRole } from '../../presentation/middlewares/requireRole.middleware';
import { UserRole } from '../../common/enums/userrole-enum';
import { requireAuth } from '../middlewares/requireauth.middleware';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const controller = makeUserController();

router.post(
  ApiEndpoints.User.UpgradeRole,
  verifyAccessToken,
  requireRole([UserRole.USER]),
  controller.upgraderole.bind(controller),
);
router.patch(
  ApiEndpoints.User.Reapply,
  verifyAccessToken,
  requireAuth,
  requireRole([UserRole.USER]),
  controller.reapply.bind(controller),
);
router.patch(
  ApiEndpoints.User.Profile,
  verifyAccessToken,
  requireRole([UserRole.USER, UserRole.EVENT_MANAGER]),
  controller.editProfile.bind(controller),
);
router.post(
  ApiEndpoints.User.Subscribe,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.subscribe.bind(controller),
);
router.get(
  ApiEndpoints.User.MySubscription,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.getMySubscription.bind(controller),
);
export default router;
