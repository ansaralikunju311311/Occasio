import { Router } from "express";
import { verifyAccessToken } from "./verifyAccessToken.middleware.js";
// import { makeAuthController } from "../../../container/auth.container.js";
import { makeAdminController } from "../../../container/admin.container.js";

const router = Router();
const controller = makeAdminController()

 
router.get("/users",verifyAccessToken,controller.getUsers.bind(controller));


router.patch("/blockorunblock/:userId",verifyAccessToken,controller.userManage.bind(controller))
// router.get("/pendingmanagers",verifyAccessToken,controller.getPendingManagers.bind(controller))
export default router