import { SignupUsecase } from "../modules/auth/application/use-cases/users/signup.usecase.js";
import { UserRepository } from "../modules/auth/infrastructure/database/user/user.repository.js";
import { BcryptHashService } from "../modules/auth/infrastructure/services/bcrypt-hash.service.js";
import { AuthController } from "../modules/auth/presentation/auth.controller.js";
import { LoginUseCase } from "../modules/auth/application/use-cases/users/login.usecase.js";
import { VerifyUseCase } from "../modules/auth/application/use-cases/users/verify-otp.usecase.js";
import { ResendotpUseCase } from "../modules/auth/application/use-cases/users/resend-otp.usecase.js";
import { ForgotpasswordUsecase } from "../modules/auth/application/use-cases/users/forgotpassword.usecase.js";
import { ResetPasswordUseCase } from "../modules/auth/application/use-cases/users/resetpassword.usecase.js";
import { EmailSerive } from "../common/service/email.service.js";
import { AdminLoginUseCase } from "../modules/auth/application/use-cases/users/adminlogin.use.js";
import { CreateToken } from "../common/service/token.service.js";
import { UpdatePasswordUseCase } from "../modules/auth/application/use-cases/users/updatepassword.usecase.js";
import { GetmeUseCase } from "../modules/auth/application/use-cases/users/getme.usecase.js";
export const makeAuthController = () => {
  const userRepository = new UserRepository();
  const hashService = new BcryptHashService();
  const comapreService = new BcryptHashService()
  const emailService = new EmailSerive();
  const createToken  = new CreateToken();
  
  

  

  const signupUsecase = new SignupUsecase(userRepository, hashService,emailService);
  const loginUseCase = new LoginUseCase(userRepository,hashService,createToken);
  const verifyUseCase = new VerifyUseCase(userRepository,createToken);
  const   resendotpUseCase   = new  ResendotpUseCase(userRepository,emailService)
  const   forgotPasswordUsecase   = new ForgotpasswordUsecase(userRepository,emailService);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository,hashService);
  const adminLoginUseCase  = new AdminLoginUseCase(userRepository,hashService,createToken)
  const getmeUseCase = new GetmeUseCase(userRepository)
  const  createtoken = new CreateToken();
  const  updatePasswordUseCase = new UpdatePasswordUseCase(userRepository,hashService,comapreService)

  return new AuthController(signupUsecase,loginUseCase,verifyUseCase,resendotpUseCase,forgotPasswordUsecase,resetPasswordUseCase,adminLoginUseCase,getmeUseCase,createtoken,updatePasswordUseCase);
};