import { LoginResponseDto } from "application/dtos/loginResponse.dto";
import { VerfiyOtpDto } from "application/dtos/verifyotp.dto";
import { OTP } from "domain/entities/otp.entity";
import { User } from "domain/entities/user.entity";

export interface IVerifyOtpUseCase {
  execute(data: VerfiyOtpDto): Promise<LoginResponseDto>;
}