import { Router } from "express";
import { verifyAccessToken } from "../verifyAccessToken.middleware.js";
import { makeUserController } from "../../../../container/user.container.js";
const router = Router();
const controller = makeUserController()

router.post("/upgraderole", verifyAccessToken, controller.upgraderole.bind(controller))
 router.patch("/reapply", verifyAccessToken, controller.reapply.bind(controller))

export default router;