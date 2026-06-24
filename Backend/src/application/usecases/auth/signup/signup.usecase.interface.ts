import type { signupDTO } from '../../../../application/dtos/signup.dto';
import type { OtpResponseDto } from '../../../../application/dtos/responses/otp-response.dto';

export interface ISignupUseCase {
  execute(data: signupDTO): Promise<OtpResponseDto | null>;
}
