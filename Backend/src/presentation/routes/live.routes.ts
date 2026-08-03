import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../../common/enums/userrole-enum';
import { MakeLiveController } from '../../container/live.containers';

const router = Router();
const controller = MakeLiveController();

// Event Manager start live stream
router.patch(
  '/:eventId/start-live',
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.startLive.bind(controller),
);

// Event Manager end live stream
router.patch(
  '/:eventId/end-live',
  verifyAccessToken,
  requireRole([UserRole.EVENT_MANAGER]),
  controller.endLive.bind(controller),
);

// Join live stream verification (Event Manager or Booked User)
router.post(
  '/:eventId/join-live',
  verifyAccessToken,
  controller.joinLive.bind(controller),
);

// Live Chat endpoints
router.get(
  '/:eventId/chat',
  verifyAccessToken,
  controller.getChatHistory.bind(controller),
);

router.post(
  '/:eventId/chat',
  verifyAccessToken,
  controller.sendChatMessage.bind(controller),
);

export default router;
