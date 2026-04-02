import { NextFunction,Request,Response } from "express";
import { HttpStatus } from "common/constants/http-status";
import { SuccessMessage,ErrorMessage} from "common/enums/message-enum";
import { SignupUsecase } from "application/usecases/auth/signup.usecase";
export class AuthController {
constructor(
private SignupUsecase: SignupUsecase,
//     private LoginUseCase: LoginUseCase,
//     private VerifyUseCase: VerifyUseCase,
//     private ResendotpUseCase: ResendotpUseCase,
//     private ForgotpasswordUsecase: ForgotpasswordUsecase,
//     private ResetPasswordUseCase: ResetPasswordUseCase,
//     private AdminLoginUseCase: AdminLoginUseCase,
//     private GetmeUseCase: GetmeUseCase,
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
}