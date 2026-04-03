import { SignupUsecase } from "application/usecases/auth/signup.usecase"
import { UserRepository } from "infrastructure/repositories/user/user.repository"
import { AuthController } from "presentation/controllers/auth.controller"
import { BcryptHashService } from "infrastructure/services/bcrypt-hash.service"
import { EmailSerive } from "common/services/email.service"
import { OtpRepository } from "infrastructure/repositories/user/otp.repository"
export const MakeAdminController=()=>{


const userRepository = new UserRepository
const hashService = new BcryptHashService
const emailService = new EmailSerive
const otpRespository = new OtpRepository

    

const signupUsecase = new SignupUsecase(userRepository,hashService,emailService,otpRespository)

return new AuthController(signupUsecase)
}