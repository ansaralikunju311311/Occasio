import { OtpResponseDto } from '../../../../application/dtos/responses/otp-response.dto';

export interface IResendUseCase {
  execute(email: string): Promise<OtpResponseDto | null>;
}
