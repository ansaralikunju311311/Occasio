import { Router } from 'express'
import { verifyAccessToken } from '../../../middleware/verifyAccessToken.middleware.js';
import { requireRole } from '../../../middleware/requireRole.middleware.js';
import { UserRole } from '../../../common/enums/user-role.enum.js';
import { MakeEventController } from '../../../container/event.container.js';
const router = Router();

const controller = MakeEventController()

router.post("/creation",
  verifyAccessToken,
  requireRole(UserRole.EVENT_MANAGER), controller.eventCreation.bind(controller)
)



router.get("/events",
  // verifyAccessToken,
  // requireRole(UserRole.EVENT_MANAGER),
  controller.allEvents.bind(controller)
)


router.get("/eventDetails/:id",
  controller.eventDetails.bind(controller)
)

router.get("/allevents",verifyAccessToken,requireRole(UserRole.ADMIN),controller.allEvents.bind(controller));


router.get("/myevents",verifyAccessToken,requireRole(UserRole.EVENT_MANAGER),controller.myEvents.bind(controller))
export default router;