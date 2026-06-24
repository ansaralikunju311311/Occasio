import type { Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage, ErrorMessage } from '../../common/enums/message-enum';
import { logger } from '../../common/logger/logger';
import type { ISignupUseCase } from '../../application/usecases/auth/signup/signup.usecase.interface';
import type { IVerifyOtpUseCase } from '../../application/usecases/auth/otp/verifyotp.usecase.interface';
import type { IResendUseCase } from '../../application/usecases/auth/resendotp/resend.usecase.interface';
import type { IApprovalUseCase } from '../../application/usecases/admin/manageApproval/managerapproval.usecase.interface';
import type { IForgotpasswordUsecase } from '../../application/usecases/auth/forgotpassword/forgot.usecase.interface';
import type { ILoginUsecase } from '../../application/usecases/auth/login/login.usecase.interface';
import type { IUpdateUseCase } from '../../application/usecases/auth/updatepassword/update.usecase.interface';
import type { IResetPasswordUseCase } from '../../application/usecases/auth/resetPassword/reset.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import type { IRefreshTokenUseCase } from '../../common/interfaces/refresh.interface';
import type { IGoogleLoginUseCase } from '../../application/usecases/auth/googleLogin/googleLogin.usecase.interface';
import type { ISessionService } from '../../common/interfaces/session.interface';
import { sendSuccess } from '../../common/utils/response';

export class AuthController {
  constructor(
    private _signupUsecase: ISignupUseCase,
    private _verifyUseCase: IVerifyOtpUseCase,
    private _resendotpUseCase: IResendUseCase,
    private _getmeUseCase: IApprovalUseCase,
    private _forgotpasswordUsecase: IForgotpasswordUsecase,
    private _loginUseCase: ILoginUsecase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _updatePasswordUseCase: IUpdateUseCase,
    private _adminLoginUseCase: ILoginUsecase,
    private _sessionService: ISessionService,
    private _refreshTokenUseCase: IRefreshTokenUseCase,
    private _googleLoginUseCase: IGoogleLoginUseCase,
  ) {}

  signup = catchAsync(async (req: Request, res: Response) => {
    logger.info('Signup route hit');
    const { name, email, password, confirmpassword, isVerified } = req.body;

    const user = await this._signupUsecase.execute({
      name,
      email,
      password,
      confirmpassword,
      isVerified: Boolean(isVerified),
    });

    sendSuccess(res, user, SuccessMessage.USER_CREATED, HttpStatus.CREATED);
  });

  verify = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    logger.info(`Verifying OTP for email: ${email}`);

    const { user, accessToken, refreshToken } =
      await this._verifyUseCase.execute({ email, otp });
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }

    sendSuccess(
      res,
      { user, accessToken },
      SuccessMessage.OTP_VERIFIED,
      HttpStatus.OK,
      {
        user,
        accessToken,
      },
    );
  });

  resnedVerify = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const verifyOtp = await this._resendotpUseCase.execute(email);

    sendSuccess(res, verifyOtp, SuccessMessage.OTP_RESENT);
  });

  getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    const user = await this._getmeUseCase.execute(userId);

    sendSuccess(res, user, undefined, HttpStatus.OK, { user });
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this._forgotpasswordUsecase.execute(email);

    sendSuccess(res, user, SuccessMessage.OTP_SENT);
  });

  logout = (req: Request, res: Response) => {
    this._sessionService.clearRefreshToken(res);

    sendSuccess(res, null, SuccessMessage.LOGOUT_SUCCESS);
  };

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.REFRESH_TOKEN_MISSING,
      });
      return;
    }

    const newaccessToken =
      await this._refreshTokenUseCase.execute(refreshToken);

    sendSuccess(
      res,
      { accessToken: newaccessToken },
      undefined,
      HttpStatus.OK,
      {
        accessToken: newaccessToken,
      },
    );
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } =
      await this._loginUseCase.execute({ email, password });
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }
    sendSuccess(
      res,
      { user, accessToken },
      SuccessMessage.LOGIN_SUCCESS,
      HttpStatus.OK,
      {
        user,
        accessToken,
      },
    );
  });

  updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    const user = await this._updatePasswordUseCase.execute({
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    sendSuccess(res, user, SuccessMessage.PASSWORD_UPDATED);
  });

  resetpassword = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, password, confirmpassword } = req.body;
    const user = await this._resetPasswordUseCase.execute({
      email,
      otp,
      password,
      confirmpassword,
    });

    sendSuccess(res, user, SuccessMessage.PASSWORD_RESET);
  });

  googleLogin = catchAsync(async (req: Request, res: Response) => {
    const oauthUser = req.user as { id: string; role: string } | undefined;

    if (!oauthUser || !oauthUser.id) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.USER_NOT_FOUND,
      });
      return;
    }

    const { accessToken, refreshToken } =
      await this._googleLoginUseCase.execute(oauthUser.id, oauthUser.role);
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }

    res.redirect(
      `${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth-success?token=${accessToken}`,
    );
  });

  adminlogin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } =
      await this._adminLoginUseCase.execute({ email, password });
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }

    sendSuccess(
      res,
      { user, accessToken },
      SuccessMessage.LOGIN_SUCCESS,
      HttpStatus.OK,
      {
        user,
        accessToken,
      },
    );
  });
}
