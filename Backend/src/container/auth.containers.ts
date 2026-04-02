import { SignupUsecase } from "application/usecases/auth/signup.usecase"
import { UserRepository } from "infrastructure/repositories/user/user.repository"
import { AuthController } from "presentation/controllers/auth.controller"
import { BcryptHashService } from "infrastructure/services/bcrypt-hash.service"
import { EmailSerive } from "common/services/email.service"
export const MakeAdminController=()=>{


const userRepository = new UserRepository
const hashService = new BcryptHashService
const emailService = new EmailSerive


    

const signupUsecase = new SignupUsecase(userRepository,hashService,emailService)

return new AuthController(signupUsecase)
}