import { signupDTO } from "application/dtos/signup.dto";
import { OTP } from "domain/entities/otp.entity";
import { User } from "domain/entities/user.entity";

export interface IForgotpasswordUsecase {
  execute(email: string): Promise<OTP | null>;
}