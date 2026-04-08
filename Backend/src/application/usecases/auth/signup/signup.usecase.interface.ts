import { signupDTO } from '../../../../application/dtos/signup.dto';
import { OTP } from '../../../../domain/entities/otp.entity';

export interface ISignupUseCase {
  execute(data: signupDTO): Promise<OTP | null>;
}
