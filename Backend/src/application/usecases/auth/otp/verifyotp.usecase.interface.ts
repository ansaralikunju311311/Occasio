import { LoginResponseDto } from '../../../../application/dtos/loginResponse.dto';
import { VerfiyOtpDto } from '../../../../application/dtos/verifyotp.dto';

export interface IVerifyOtpUseCase {
  execute(data: VerfiyOtpDto): Promise<LoginResponseDto>;
}
