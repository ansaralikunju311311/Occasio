import { NextFunction,Request,Response } from "express";
import { HttpStatus } from "common/constants/http-status";
import { SuccessMessage,ErrorMessage} from "common/enums/message-enum";
import { SignupUsecase } from "application/usecases/auth/signup/signup.usecase";
import { VerifyUseCase } from "application/usecases/auth/otp/verifyotp.usecase";
import { ResendotpUseCase } from "application/usecases/auth/resendotp/resend.usecase";
import { GetmeUseCase } from "application/usecases/auth/restore/getme.usecase";
export class AuthController {
constructor(
private SignupUsecase: SignupUsecase,
//     private LoginUseCase: LoginUseCase,
    private VerifyUseCase: VerifyUseCase,
    private ResendotpUseCase: ResendotpUseCase,
//     private ForgotpasswordUsecase: ForgotpasswordUsecase,
//     private ResetPasswordUseCase: ResetPasswordUseCase,
//     private AdminLoginUseCase: AdminLoginUseCase,
    private GetmeUseCase: GetmeUseCase,
//     private tokenService: CreateToken,
//     private UpdatePasswordUseCase: UpdatePasswordUseCase
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
    



}