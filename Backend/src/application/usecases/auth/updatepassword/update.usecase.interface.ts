import type { UpdatePasswordDto } from '../../../../application/dtos/updatepassword.dto';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';

export interface IUpdateUseCase {
  execute(data: UpdatePasswordDto): Promise<UserResponseDto>;
}
