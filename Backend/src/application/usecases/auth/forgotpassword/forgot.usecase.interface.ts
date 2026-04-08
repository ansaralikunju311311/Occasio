import { OTP } from '../../../../domain/entities/otp.entity';

export interface IForgotpasswordUsecase {
  execute(email: string): Promise<OTP | null>;
}
