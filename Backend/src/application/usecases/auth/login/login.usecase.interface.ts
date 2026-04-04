import { LoginDto } from "application/dtos/login.dto";
import { LoginResponseDto } from "application/dtos/loginResponse.dto";
import { signupDTO } from "application/dtos/signup.dto";
import { OTP } from "domain/entities/otp.entity";
import { User } from "domain/entities/user.entity";

export interface ILoginUsecase {
  execute(data: LoginDto): Promise<LoginResponseDto | null>;
}