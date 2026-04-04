import { signupDTO } from "application/dtos/signup.dto";
import { UpdatePasswordDto } from "application/dtos/updatepassword.dto";
import { OTP } from "domain/entities/otp.entity";
import { User } from "domain/entities/user.entity";

export interface IUpdateUseCase {
  execute(data: UpdatePasswordDto): Promise<void>;
}