import { ResetPasswordDTO } from '../../../../application/dtos/reset.dto';
import { User } from '../../../../domain/entities/user.entity';

export interface IResetPasswordUseCase {
  execute(data: ResetPasswordDTO): Promise<User>;
}
