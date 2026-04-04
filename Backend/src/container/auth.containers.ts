import { SignupUsecase } from "application/usecases/auth/signup/signup.usecase"
import { UserRepository } from "infrastructure/repositories/user/user.repository"
import { AuthController } from "presentation/controllers/auth.controller"
import { BcryptHashService } from "infrastructure/services/bcrypt-hash.service"
import { EmailSerive } from "common/services/email.service"
import { OtpRepository } from "infrastructure/repositories/user/otp.repository"
import { VerifyUseCase } from "application/usecases/auth/otp/verifyotp.usecase"
 import { CreateToken } from "common/services/token.service"
import { ResendotpUseCase } from "application/usecases/auth/resendotp/resend.usecase"
import { GetmeUseCase } from "application/usecases/auth/restore/getme.usecase"
import { ForgotpasswordUsecase } from "application/usecases/auth/forgotpassword/forgot.usecase"

// import  {ITokenService}  from "domain/services/token.service.interface"
export const MakeAdminController=()=>{


const userRepository = new UserRepository()
const hashService = new BcryptHashService()
const emailService = new EmailSerive()
const otpRespository = new OtpRepository()
const  tokenService = new CreateToken()

    

const signupUsecase = new SignupUsecase(userRepository,hashService,emailService,otpRespository)
const getmeUseCase =   new GetmeUseCase(userRepository)
const verifyUseCase = new VerifyUseCase(
  userRepository,
  otpRespository,
  tokenService
)
const resendotpUseCase = new ResendotpUseCase(userRepository,emailService,otpRespository)
const forgotpasswordUsecase = new ForgotpasswordUsecase(userRepository,emailService,otpRespository)
return new AuthController(signupUsecase,verifyUseCase,resendotpUseCase,getmeUseCase,forgotpasswordUsecase)
}