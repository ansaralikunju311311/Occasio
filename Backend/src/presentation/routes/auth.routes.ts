import { Router } from 'express';
import passport from 'passport';

import { requireAuth } from '../middlewares/requireauth.middleware';
import { verifyAccessToken } from '../../presentation/middlewares/verifyAccessToken.middleware';
import { MakeAdminController } from '../../container/auth.containers';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const controller = MakeAdminController();

router.post(ApiEndpoints.Auth.Signup, controller.signup.bind(controller));
router.post(ApiEndpoints.Auth.VerifyOtp, controller.verify.bind(controller));
router.post(
  ApiEndpoints.Auth.ResendOtp,
  controller.resnedVerify.bind(controller),
);
router.get(
  ApiEndpoints.Auth.Me,
  verifyAccessToken,
  requireAuth,
  controller.getMe.bind(controller),
);
router.post(
  ApiEndpoints.Auth.ForgotPassword,
  controller.forgotPassword.bind(controller),
);
router.post(ApiEndpoints.Auth.Logout, controller.logout.bind(controller));
router.post(
  ApiEndpoints.Auth.Refresh,
  controller.refreshToken.bind(controller),
);
router.post(ApiEndpoints.Auth.Login, controller.login.bind(controller));
router.post(
  ApiEndpoints.Auth.UpdatePassword,
  controller.updatePassword.bind(controller),
);
router.post(
  ApiEndpoints.Auth.ResetPassword,
  controller.resetpassword.bind(controller),
);

router.get(ApiEndpoints.Auth.Google, (req, res, next) => {
  const role = req.query.role || 'USER';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ role }),
  })(req, res, next);
});

router.get(
  ApiEndpoints.Auth.GoogleCallback,
  passport.authenticate('google', { session: false }),
  controller.googleLogin.bind(controller),
);

router.post(
  ApiEndpoints.Auth.AdminLogin,
  controller.adminlogin.bind(controller),
);

export default router;
