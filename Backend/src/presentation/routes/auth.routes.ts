import express from "express";
import { Router } from "express";
import { MakeAdminController } from "../../container/auth.containers";
// const router = express.Router();

const router = Router()
const controller = MakeAdminController()

router.post("/signup", controller.signup.bind(controller))

export default router