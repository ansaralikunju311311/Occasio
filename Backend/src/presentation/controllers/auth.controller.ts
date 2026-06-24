import { Request, response, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage, ErrorMessage } from '../../common/enums/message-enum';
import { logger } from '../../common/logger/logger';
import { ISignupUseCase } from '../../application/usecases/auth/signup/signup.usecase.interface';
import { IVerifyOtpUseCase } from '../../application/usecases/auth/otp/verifyotp.usecase.interface';
import { IResendUseCase } from '../../application/usecases/auth/resendotp/resend.usecase.interface';
import { IApprovalUseCase } from '../../application/usecases/admin/manageApproval/managerapproval.usecase.interface';
import { IForgotpasswordUsecase } from '../../application/usecases/auth/forgotpassword/forgot.usecase.interface';
import { ILoginUsecase } from '../../application/usecases/auth/login/login.usecase.interface';
import { IUpdateUseCase } from '../../application/usecases/auth/updatepassword/update.usecase.interface';
import { IResetPasswordUseCase } from '../../application/usecases/auth/resetPassword/reset.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import { IRefreshTokenUseCase } from '../../common/interfaces/refresh.interface';
import { IGoogleLoginUseCase } from '../../application/usecases/auth/googleLogin/googleLogin.usecase.interface';
import { ISessionService } from '../../common/interfaces/session.interface';

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
    private _googleLoginUseCase: IGoogleLoginUseCase
  ) {}

  signup = catchAsync(async (req: Request, res: Response) => {
    logger.info('Signup route hit');
    const { name, email, password, confirmpassword, isVerified } = req.body;

    const user = await this._signupUsecase.execute({
      name,
      email,
      password,
      confirmpassword,
      isVerified,
    });

    res.status(HttpStatus.CREATED).json({
      message: SuccessMessage.USER_CREATED,
      data: user,
    });
  });

  verify = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    logger.info(`Verifying OTP for email: ${email}`);

    const { user, accessToken, refreshToken } = await this._verifyUseCase.execute({ email, otp });
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.OTP_VERIFIED,
      user,
      accessToken,
    });
  });

  resnedVerify = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const verifyOtp = await this._resendotpUseCase.execute(email);
    
    res.status(HttpStatus.OK).json({
      message: SuccessMessage.OTP_RESENT,
      data: verifyOtp,
    });
  });

  getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const user = await this._getmeUseCase.execute(userId);
    
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this._forgotpasswordUsecase.execute(email);

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.OTP_SENT,
      data: user,
    });
  });

  logout = (req: Request, res: Response) => {
  

    this._sessionService.clearRefreshToken(res)

    return res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessage.LOGOUT_SUCCESS,
    });
  };

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.REFRESH_TOKEN_MISSING,
      });
    }

   

    const newaccessToken = await this._refreshTokenUseCase.execute(refreshToken)

    return res.json({
      accessToken: newaccessToken,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this._loginUseCase.execute({ email, password });
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }
    res.status(HttpStatus.OK).json({
      message: SuccessMessage.LOGIN_SUCCESS,
      user,
      accessToken,
    });
  });

  updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    const user = await this._updatePasswordUseCase.execute({
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.PASSWORD_UPDATED,
      data: user,
    });
  });

  resetpassword = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, password, confirmpassword } = req.body;
    const user = await this._resetPasswordUseCase.execute({
      email,
      otp,
      password,
      confirmpassword,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.PASSWORD_RESET,
      data: user,
    });
  });

  googleLogin =catchAsync(async (req: Request, res: Response) => {
    const user = req.user as any;

    if (!user || !user.id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.USER_NOT_FOUND,
      });
    }
    // const accessToken = this.tokenService.generateAccessToken({
    //   userId: user.id,
    //   role: user.role,
    // });

    // const refreshToken = this.tokenService.generateRefreshToken({
    //   userId: user.id,
    //   role: user.role,
    // });

       const { accessToken, refreshToken } = await this._googleLoginUseCase.execute(user.id,user.role)
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }

    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
  });

  adminlogin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this._adminLoginUseCase.execute({ email, password });
    if (refreshToken) {
      this._sessionService.setRefreshToken(res, refreshToken);
    }


    res.status(HttpStatus.OK).json({
      message: SuccessMessage.LOGIN_SUCCESS,
      user,
      accessToken,
    });
  });
}
