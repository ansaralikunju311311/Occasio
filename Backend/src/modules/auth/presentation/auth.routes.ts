import { Router } from "express";
// import { AuthController } from "./auth.controller.js";
import { makeAuthController } from "../../../container/auth.container.js";
const router = Router();
const controller =  makeAuthController();

// router.post("/signup", (req, res) => controller.signup(req, res));

router.post("/signup",controller.signup.bind(controller))        //  after we use the DI we call directly time lose the this so here we use this way to bind the controller that time never lose the value
router.post("/login",controller.login.bind(controller))
router.post("/verify-otp",controller.verify.bind(controller))
router.post("/resend-otp",controller.resnedVerify.bind(controller))

// router.post("/signup",controller.signup)
export default router;