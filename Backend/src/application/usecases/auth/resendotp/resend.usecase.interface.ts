import { OTP } from '../../../../domain/entities/otp.entity';

export interface IResendUseCase {
  execute(email: string): Promise<OTP | null>;
}
