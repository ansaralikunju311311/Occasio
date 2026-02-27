import { Request, Response } from "express";
import { SignupUsecase } from "../application/use-cases/signup.usecase.js";
// import { UserRepository } from "../infrastructure/database/user.repository.js";
// import { BcryptHashService } from "../infrastructure/services/bcrypt-hash.service.js";

export class AuthController {
  constructor(private SignupUsecase :SignupUsecase){}
  async signup(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      // manually wiring dependencies (later we use DI container)


      // const userRepository = new UserRepository();
      // const hashService = new BcryptHashService();

      // const signupUseCase = new SignupUsecase(userRepository, hashService);

      const user = await this.SignupUsecase.execute({ name, email, password });

      return res.status(201).json({
        message: "User created successfully",
        data: user
      });

    } catch (error: any) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
}