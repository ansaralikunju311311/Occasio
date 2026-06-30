import { Router } from 'express';

import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../../common/enums/userrole-enum';
import { MakeEventController } from '../../container/event.containers';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();

const controller = MakeEventController();

router.post(
  ApiEndpoints.Events.Creation,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.eventCreation.bind(controller),
);

router.get(ApiEndpoints.Events.Events, controller.allEvents.bind(controller));

router.get(
  ApiEndpoints.Events.EventDetails,
  controller.eventDetails.bind(controller),
);

router.get(
  ApiEndpoints.Events.AllEvents,
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.allEvents.bind(controller),
);

router.get(
  ApiEndpoints.Events.MyEvents,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.myEvents.bind(controller),
);

router.put(
  ApiEndpoints.Events.Update,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.updateEvents.bind(controller),
);

router.delete(
  ApiEndpoints.Events.Delete,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER, UserRole.ADMIN]),
  controller.deleteEvent.bind(controller),
);

router.get(
  ApiEndpoints.Events.ManagerStats,
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.getManagerStats.bind(controller),
);

export default router;

