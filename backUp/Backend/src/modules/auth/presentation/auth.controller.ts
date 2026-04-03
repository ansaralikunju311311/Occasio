import { NextFunction, Request, Response } from "express";
import { SignupUsecase } from "../application/use-cases/users/signup.usecase.js";
import { LoginUseCase } from "../application/use-cases/users/login.usecase.js";
import { VerifyUseCase } from "../application/use-cases/users/verify-otp.usecase.js"
import { ResendotpUseCase } from "../application/use-cases/users/resend-otp.usecase.js";
import { ForgotpasswordUsecase } from "../application/use-cases/users/forgotpassword.usecase.js";
import { ResetPasswordUseCase } from "../application/use-cases/users/resetpassword.usecase.js";
import { HttpStatus } from "../../../common/constants/http-stattus.js";
import { AdminLoginUseCase } from "../application/use-cases/users/adminlogin.use.js";
import { GetmeUseCase } from "../application/use-cases/users/getme.usecase.js";
import { CreateToken } from "../../../common/service/token.service.js";
import { UpdatePasswordUseCase } from "../application/use-cases/users/updatepassword.usecase.js";
import { SuccessMessage, ErrorMessage } from "../../../common/enums/message.enum.js";
// import { ITokenService } from "../domain/services/token.service.interface.js";
export class AuthController {
  constructor(private SignupUsecase: SignupUsecase,
    private LoginUseCase: LoginUseCase,
    private VerifyUseCase: VerifyUseCase,
    private ResendotpUseCase: ResendotpUseCase,
    private ForgotpasswordUsecase: ForgotpasswordUsecase,
    private ResetPasswordUseCase: ResetPasswordUseCase,
    private AdminLoginUseCase: AdminLoginUseCase,
    private GetmeUseCase: GetmeUseCase,
    private tokenService: CreateToken,
    private UpdatePasswordUseCase: UpdatePasswordUseCase
    //  private tokenService:ITokenService

  ) { }
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {

    console.log("bkjbhjbchjb")
    try {

      console.log("rjfjrf", req.body)
      const { name, email, password, confirmpassword, isVerified } = req.body;

      const user = await this.SignupUsecase.execute({ name, email, password, confirmpassword, isVerified });
      console.log(user)
      res.status(HttpStatus.CREATED).json({

        message: SuccessMessage.USER_CREATED,
        data: user
      });

    } catch (error: any) {
      console.log(error.message)
      next(error)
    }
  }




  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {


      const { email, password } = req.body;
      console.log(req.body)
      const { user, accessToken, refreshToken } = await this.LoginUseCase.execute({ email, password });


      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })



      console.log("onnn check,", user)
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.LOGIN_SUCCESS
        ,
        user, accessToken
      })
    } catch (error: any) {
      next(error)
    }
  }


  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;


      console.log('opt verification come data', req.body)
      const { user, accessToken, refreshToken } = await this.VerifyUseCase.execute({ email, otp });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      //  console.log("checking",user,refreshToken,accessToken)
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.OTP_VERIFIED, user, accessToken
      })
    }
    catch (error: any) {
      next(error)
    }
  }

  async resnedVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const verifyOtp = await this.ResendotpUseCase.execute(email);
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.OTP_RESENT, data: verifyOtp
      })
    } catch (error: any) {
      console.log(error);
      next(error)
    }
  }


  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("vjfncjfjv")
    try {
      const { email } = req.body;


      console.log("fjvndfjvfhd")

      const user = await this.ForgotpasswordUsecase.execute(email);

      // console.log("th user here",user)
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.OTP_SENT, data: user
      })
    }
    catch (error: any) {
      //  console.log('error')
      next(error)
    }

  }



  async resetpassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp, password, confirmpassword } = req.body;


      // console.log(req.body)
      const user = await this.ResetPasswordUseCase.execute({ email, otp, password, confirmpassword });
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.PASSWORD_RESET, data: user
      })
    } catch (error: any) {
      next(error)
    }
  }


  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, currentPassword, newPassword, confirmPassword } = req.body;

      const user = await this.UpdatePasswordUseCase.execute({ email, currentPassword, newPassword, confirmPassword });
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.PASSWORD_UPDATED, data: user
      })
    } catch (error) {
      next(error);
    }
  }







  async adminlogin(req: Request, res: Response, next: NextFunction): Promise<void> {

    // console.log('jnjnfdjnfkdjnfljnfljdnfdljfnd')

    try {


      const { email, password, role } = req.body;
      // console.log(req.body)
      const { user, accessToken, refreshToken } = await this.AdminLoginUseCase.execute({ email, password, role });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })


      // console.log("onnn check,",user,refreshToken,accessToken)
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.LOGIN_SUCCESS
        ,
        user, accessToken
      })
    } catch (error: any) {
      next(error)
    }
  }


  logout = async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax"
    });

    return res.status(200).json({
      success: true,
      message: SuccessMessage.LOGOUT_SUCCESS
    });
  };

  async getMe(req: Request, res: Response) {

    try {
      const decode = (req as any).user;

      console.log("decoded ", decode)
      const user = await this.GetmeUseCase.execute(decode.userId)
      res.status(HttpStatus.OK).json({
        user
      })
    } catch (error) {


      console.log(error)
    }
  }



  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.REFRESH_TOKEN_MISSING
      })
    }


    try {
      const decode = this.tokenService.verifyRefreshToken(refreshToken) as any


      const newaccessToken = this.tokenService.generateAccessToken({
        userId: decode.userId,
        role: decode.role
      })


      return res.json({
        accessToken: newaccessToken
      })
    } catch (error) {


      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.INVALID_REFRESH_TOKEN
      })
    }


  }


  async googleLogin(req: Request, res: Response) {

    const user = req.user as any;

    if (!user || !user.id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: ErrorMessage.USER_NOT_FOUND
      });
    }
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      role: user.role
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`);
  }
}








