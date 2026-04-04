import { ResetPasswordDTO } from "application/dtos/reset.dto";
import { signupDTO } from "application/dtos/signup.dto";
import { OTP } from "domain/entities/otp.entity";
import { User } from "domain/entities/user.entity";

export interface IResendUseCase {
  execute(data:ResetPasswordDTO): Promise<void>;
}