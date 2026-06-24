import type { OtpResponseDto } from '../../../../application/dtos/responses/otp-response.dto';

export interface IForgotpasswordUsecase {
  execute(email: string): Promise<OtpResponseDto | null>;
}
