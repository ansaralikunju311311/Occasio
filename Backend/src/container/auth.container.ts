import { SignupUsecase } from "../modules/auth/application/use-cases/signup.usecase.js";
import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js";
import { BcryptHashService } from "../modules/auth/infrastructure/services/bcrypt-hash.service.js";
import { AuthController } from "../modules/auth/presentation/auth.controller.js";
import { LoginUseCase } from "../modules/auth/application/use-cases/login.usecase.js";
import { VerifyUseCase } from "../modules/auth/application/use-cases/verify-otp.usecase.js";
import { ResendotpUseCase } from "../modules/auth/application/use-cases/resend-otp.usecase.js";
import { ForgotpasswordUsecase } from "../modules/auth/application/use-cases/forgotpassword.usecase.js";
export const makeAuthController = () => {
  const userRepository = new UserRepository();
  const hashService = new BcryptHashService();

  const signupUsecase = new SignupUsecase(userRepository, hashService);
  const loginUseCase = new LoginUseCase(userRepository,hashService);
  const verifyUseCase = new VerifyUseCase(userRepository);
  const   resendotpUseCase   = new  ResendotpUseCase(userRepository)
  const   forgotPasswordUsecase   = new ForgotpasswordUsecase(userRepository)
  return new AuthController(signupUsecase,loginUseCase,verifyUseCase,resendotpUseCase,forgotPasswordUsecase);
};