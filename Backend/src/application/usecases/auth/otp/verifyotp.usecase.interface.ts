import type { LoginResponseDto } from '../../../../application/dtos/loginResponse.dto';
import type { VerfiyOtpDto } from '../../../../application/dtos/verifyotp.dto';

export interface IVerifyOtpUseCase {
  execute(data: VerfiyOtpDto): Promise<LoginResponseDto>;
}
