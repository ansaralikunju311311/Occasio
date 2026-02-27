import { SignupUsecase } from "../modules/auth/application/use-cases/signup.usecase.js";
import { UserRepository } from "../modules/auth/infrastructure/database/user.repository.js";
import { BcryptHashService } from "../modules/auth/infrastructure/services/bcrypt-hash.service.js";
import { AuthController } from "../modules/auth/presentation/auth.controller.js";

export const makeAuthController = () => {
  const userRepository = new UserRepository();
  const hashService = new BcryptHashService();

  const signupUseCase = new SignupUsecase(userRepository, hashService);

  return new AuthController(signupUseCase);
};