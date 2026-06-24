import type { ResetPasswordDTO } from '../../../../application/dtos/reset.dto';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';

export interface IResetPasswordUseCase {
  execute(data: ResetPasswordDTO): Promise<UserResponseDto>;
}
