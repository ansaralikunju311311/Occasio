import { signupDTO } from '../../../../application/dtos/signup.dto';
import { UpdatePasswordDto } from '../../../../application/dtos/updatepassword.dto';
import { OTP } from '../../../../domain/entities/otp.entity';
import { User } from '../../../../domain/entities/user.entity';
import { UpgraderoleDto } from '../../../../application/dtos/upgraderole.dto';
export interface IUpgradeUseCase {
  execute(data: UpgraderoleDto): Promise<User | null>;
}
