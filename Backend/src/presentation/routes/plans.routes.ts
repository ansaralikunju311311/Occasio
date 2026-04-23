import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
// import { makeAuthController } from "../../../container/auth.container";
import { requireRole } from '../middlewares/requireRole.middleware';
// import { makeAdminController } from '../../container/admin.containers';
import { UserRole } from '../../common/enums/userrole-enum';

import { makePlanController } from '../../container/subscription.containers';

const router = Router();
const controller = makePlanController();


router.post('/createplans',
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.createPlans.bind(controller))

router.get('/getplans',
  verifyAccessToken,
  requireRole([UserRole.ADMIN, UserRole.EVENT_MANAGER, UserRole.USER]),
  controller.getPlans.bind(controller))

router.patch('/updateplan/:id',
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.updatePlan.bind(controller))

export default router;
