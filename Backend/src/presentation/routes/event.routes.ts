import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../../common/enums/userrole-enum';
import { MakeEventController } from '../../container/event.containers';
const router = Router();

const controller = MakeEventController();

router.post(
  '/creation',
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.eventCreation.bind(controller),
);

router.get(
  '/events',
  // verifyAccessToken,
  // requireRole(UserRole.EVENT_MANAGER),
  controller.allEvents.bind(controller),
);

router.get('/eventDetails/:id', controller.eventDetails.bind(controller));

router.get(
  '/allevents',
  verifyAccessToken,
  requireRole([UserRole.ADMIN]),
  controller.allEvents.bind(controller),
);

router.get(
  '/myevents',
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.myEvents.bind(controller),
);


router.put("/update/:id", verifyAccessToken, requireRole([UserRole.EVENT_MANAGER]), controller.updateEvents.bind(controller));
router.delete("/:id", verifyAccessToken, requireRole([UserRole.EVENT_MANAGER, UserRole.ADMIN]), controller.deleteEvent.bind(controller));
export default router;
