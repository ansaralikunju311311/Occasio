import express from 'express';
import { Router } from 'express';
import passport from 'passport';
import { requireAuth } from '../middlewares/requireauth.middleware';
import { verifyAccessToken } from '../../presentation/middlewares/verifyAccessToken.middleware';
import { MakeAdminController } from '../../container/auth.containers';
// const router = express.Router();

const router = Router();
const controller = MakeAdminController();

router.post('/signup', controller.signup.bind(controller));
router.post('/verify-otp', controller.verify.bind(controller));
router.post('/resend-otp', controller.resnedVerify.bind(controller));
router.get(
  '/me',
  verifyAccessToken,
  requireAuth,
  controller.getMe.bind(controller),
);
router.post('/forgot-password', controller.forgotPassword.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.post('/refresh', controller.refreshToken.bind(controller));
router.post('/login', controller.login.bind(controller));
router.post('/updatepassword', controller.updatePassword.bind(controller));
router.post('/reset-password', controller.resetpassword.bind(controller));

router.get('/google', (req, res, next) => {
  const role = req.query.role || 'USER';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ role }),
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  controller.googleLogin.bind(controller),
);

router.post('/admin/login', controller.adminlogin.bind(controller));

export default router;
