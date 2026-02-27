import { SignupUsecase } from "../modules/auth/application/use-cases/signup.usecase.js";
import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js";
import { BcryptHashService } from "../modules/auth/infrastructure/services/bcrypt-hash.service.js";
import { AuthController } from "../modules/auth/presentation/auth.controller.js";
import { LoginUseCase } from "../modules/auth/application/use-cases/login.usecase.js";
export const makeAuthController = () => {
  const userRepository = new UserRepository();
  const hashService = new BcryptHashService();

  const signupUsecase = new SignupUsecase(userRepository, hashService);
  const loginUseCase = new LoginUseCase(userRepository,hashService)

  return new AuthController(signupUsecase,loginUseCase);
};