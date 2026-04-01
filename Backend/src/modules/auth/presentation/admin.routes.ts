import { Router } from "express";
import { verifyAccessToken } from "../../../middleware/verifyAccessToken.middleware.js";
// import { makeAuthController } from "../../../container/auth.container.js";
import { requireRole } from "../../../middleware/requireRole.middleware.js";
import { makeAdminController } from "../../../container/admin.container.js";
import { UserRole } from "../../../common/enums/user-role.enum.js";

const router = Router();
const controller = makeAdminController()

 
router.get("/users",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.getUsers.bind(controller));


router.patch("/blockorunblock/:userId",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.userManage.bind(controller));
router.get("/userDetails/:userId",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.userDetails.bind(controller));



router.get("/pendingmanagers/:userId",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.pendingmanagerDetails.bind(controller));



router.patch("/approval/:id",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.managerApproval.bind(controller));
router.patch("/rejection/:id",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.managerRejection.bind(controller));

router.get("/managerDetails/:id",verifyAccessToken,requireRole([UserRole.ADMIN]),controller.managerDetails.bind(controller))
export default router;