import { Router } from "express";
import { verifyAccessToken } from "../../../../middleware/verifyAccessToken.middleware.js";
import { makeUserController } from "../../../../container/user.container.js";
import { requireRole } from "../../../../middleware/requireRole.middleware.js";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
const router = Router();
const controller = makeUserController()

router.post("/upgraderole", verifyAccessToken,requireRole([UserRole.USER]),controller.upgraderole.bind(controller))
 router.patch("/reapply", verifyAccessToken,requireRole([UserRole.USER]),controller.reapply.bind(controller))
 router.patch("/profile",verifyAccessToken,requireRole([UserRole.USER ,UserRole.EVENT_MANAGER]),controller.editProfile.bind(controller))
export default router;