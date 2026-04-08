import { ResetPasswordDTO } from '../../../../application/dtos/reset.dto';

export interface IResendUseCase {
  execute(data: ResetPasswordDTO): Promise<void>;
}
