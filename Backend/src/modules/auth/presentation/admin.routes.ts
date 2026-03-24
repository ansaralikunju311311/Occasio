import { Router } from "express";
import { verifyAccessToken } from "./verifyAccessToken.middleware.js";
// import { makeAuthController } from "../../../container/auth.container.js";
import { makeAdminController } from "../../../container/admin.container.js";

const router = Router();
const controller = makeAdminController()

 
router.get("/users",verifyAccessToken,controller.getUsers.bind(controller));


router.patch("/blockorunblock/:userId",verifyAccessToken,controller.userManage.bind(controller));
router.get("/userDetails/:userId",verifyAccessToken,controller.userDetails.bind(controller));



router.get("/pendingmanagers/:userId",verifyAccessToken,controller.pendingmanagerDetails.bind(controller));



router.patch("/approval/:id",verifyAccessToken,controller.managerApproval.bind(controller));
router.patch("/rejection/:id",verifyAccessToken,controller.managerRejection.bind(controller))
export default router;