import { NextFunction,Request,Response } from "express";
import { HttpStatus } from "common/constants/http-status";
import { SuccessMessage,ErrorMessage} from "common/enums/message-enum";
import { SignupUsecase } from "application/usecases/auth/signup/signup.usecase";
import { VerifyUseCase } from "application/usecases/auth/otp/verifyotp.usecase";
import { ResendotpUseCase } from "application/usecases/auth/resendotp/resend.usecase";
import { GetmeUseCase } from "application/usecases/auth/restore/getme.usecase";
import { ForgotpasswordUsecase } from "application/usecases/auth/forgotpassword/forgot.usecase";
import { CreateToken } from "common/services/token.service";
import { LoginUseCase } from "application/usecases/auth/login/login.usecase";
import { UpdatePasswordUseCase } from "application/usecases/auth/updatepassword/updatepassword.usecase";
import { ResetPasswordUseCase } from "application/usecases/auth/reserPassword/reset.uecase";

export class AuthController {
constructor(
private SignupUsecase: SignupUsecase,

    private VerifyUseCase: VerifyUseCase,
    private ResendotpUseCase: ResendotpUseCase,
     private GetmeUseCase: GetmeUseCase,
     private ForgotpasswordUsecase: ForgotpasswordUsecase,
       private tokenService: CreateToken,
            private LoginUseCase: LoginUseCase,
     private ResetPasswordUseCase: ResetPasswordUseCase,
//     private AdminLoginUseCase: AdminLoginUseCase,

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



    async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;


      console.log('opt verification come data', req.body)
      const { user
         , accessToken, refreshToken
       } = await this.VerifyUseCase.execute({ email, otp });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      //  console.log("checking",user,refreshToken,accessToken)
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.OTP_VERIFIED, user
         , accessToken
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


}