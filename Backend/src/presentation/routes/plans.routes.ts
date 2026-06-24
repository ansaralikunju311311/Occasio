import { Router } from 'express';

import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../../common/enums/userrole-enum';
import { makePlanController } from '../../container/subscription.containers';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const controller = makePlanController();

router.post(
  ApiEndpoints.Plans.CreatePlans,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.createPlans.bind(controller),
);

router.get(
  ApiEndpoints.Plans.GetPlans,
  verifyAccessToken,
  requireRole([UserRole.ADMIN, UserRole.EVENT_MANAGER, UserRole.USER]),
  controller.getPlans.bind(controller),
);

router.patch(
  ApiEndpoints.Plans.UpdatePlan,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.updatePlan.bind(controller),
);

export default router;
