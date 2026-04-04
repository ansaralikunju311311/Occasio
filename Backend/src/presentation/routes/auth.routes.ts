import express from "express";
import { Router } from "express";
import { verifyAccessToken } from "presentation/middlewares/verifyAccessToken.middleware";
import { MakeAdminController } from "../../container/auth.containers";
// const router = express.Router();

const router = Router()
const controller = MakeAdminController()

router.post("/signup", controller.signup.bind(controller));

router.post("/verify-otp", controller.verify.bind(controller))
router.post("/resend-otp", controller.resnedVerify.bind(controller))
router.get("/me", verifyAccessToken, controller.getMe.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.post("/logout", controller.logout.bind(controller));
router.post("/refresh", controller.refreshToken.bind(controller))
router.post("/login", controller.login.bind(controller))
router.post("/updatepassword",controller.updatePassword.bind(controller))
router.post("/reset-password", controller.resetpassword.bind(controller));











export default router