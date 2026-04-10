import { Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage, ErrorMessage } from '../../common/enums/message-enum';
import { logger } from '@/common/logger/logger';
import { ISignupUseCase } from '@/application/usecases/auth/signup/signup.usecase.interface';
import { IVerifyOtpUseCase } from '@/application/usecases/auth/otp/verifyotp.usecase.interface';
import { IResendUseCase } from '@/application/usecases/auth/resendotp/resend.usecase.interface';
import { IApprovalUseCase } from '@/application/usecases/admin/manageApproval/managerapproval.usecase.interface';
import { IForgotpasswordUsecase } from '@/application/usecases/auth/forgotpassword/forgot.usecase.interface';
import { ITokenService } from '@/domain/services/token.service.interface';
import { ILoginUsecase } from '@/application/usecases/auth/login/login.usecase.interface';
import { IUpdateUseCase } from '@/application/usecases/auth/updatepassword/update.usecase.interface';
import { IResetPasswordUseCase } from '@/application/usecases/auth/resetPassword/reset.usecase.interface';
import { catchAsync } from '@/common/utils/catchAsync';

export class AuthController {
  constructor(
    private SignupUsecase: ISignupUseCase,
    private VerifyUseCase: IVerifyOtpUseCase,
    private ResendotpUseCase: IResendUseCase,
    private GetmeUseCase: IApprovalUseCase,
    private ForgotpasswordUsecase: IForgotpasswordUsecase,
    private tokenService: ITokenService,
    private LoginUseCase: ILoginUsecase,
    private ResetPasswordUseCase: IResetPasswordUseCase,
    private UpdatePasswordUseCase: IUpdateUseCase,
    private AdminLoginUseCase: ILoginUsecase,
  ) {}

  signup = catchAsync(async (req: Request, res: Response) => {
    logger.info('Signup route hit');
    const { name, email, password, confirmpassword, isVerified } = req.body;

    const user = await this.SignupUsecase.execute({
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

    const { user, accessToken, refreshToken } = await this.VerifyUseCase.execute({ email, otp });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.OTP_VERIFIED,
      user,
      accessToken,
    });
  });

  resnedVerify = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const verifyOtp = await this.ResendotpUseCase.execute(email);
    
    res.status(HttpStatus.OK).json({
      message: SuccessMessage.OTP_RESENT,
      data: verifyOtp,
    });
  });

  getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const user = await this.GetmeUseCase.execute(userId);
    
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.ForgotpasswordUsecase.execute(email);

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.OTP_SENT,
      data: user,
    });
  });

  logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

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

    const decode = this.tokenService.verifyRefreshToken(refreshToken) as any;
    const newaccessToken = this.tokenService.generateAccessToken({
      userId: decode.userId,
      role: decode.role,
    });

    return res.json({
      accessToken: newaccessToken,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.LoginUseCase.execute({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.LOGIN_SUCCESS,
      user,
      accessToken,
    });
  });

  updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    const user = await this.UpdatePasswordUseCase.execute({
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
    const user = await this.ResetPasswordUseCase.execute({
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

  googleLogin = (req: Request, res: Response) => {
    const user = req.user as any;

    if (!user || !user.id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.USER_NOT_FOUND,
      });
    }
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
  };

  adminlogin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.AdminLoginUseCase.execute({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.LOGIN_SUCCESS,
      user,
      accessToken,
    });
  });
}
