import { Router } from 'express';

import { verifyAccessToken } from '../../presentation/middlewares/verifyAccessToken.middleware';
import { makeUserController } from '../../container/user.containers';
import { requireRole } from '../../presentation/middlewares/requireRole.middleware';
import { UserRole } from '../../common/enums/userrole-enum';
import { requireAuth } from '../middlewares/requireauth.middleware';
const router = Router();
const controller = makeUserController();

router.post(
  '/upgraderole',
  verifyAccessToken,
  requireRole([UserRole.USER]),
  controller.upgraderole.bind(controller),
);
router.patch(
  '/reapply',
  verifyAccessToken,
  requireAuth,
  requireRole([UserRole.USER]),
  controller.reapply.bind(controller),
);
router.patch(
  '/profile',
  verifyAccessToken,
  requireRole([UserRole.USER, UserRole.EVENT_MANAGER]),
  controller.editProfile.bind(controller),
);
router.post(
  '/subscribe',
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.subscribe.bind(controller),
);
router.get(
  '/my-subscription',
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.getMySubscription.bind(controller),
);
export default router;
