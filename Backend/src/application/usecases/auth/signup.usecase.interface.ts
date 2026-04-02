import { signupDTO } from "application/dtos/signup.dto";
import { User } from "domain/entities/user.entity";

export interface ISignupUseCase {
  execute(data: signupDTO): Promise<User>;
}