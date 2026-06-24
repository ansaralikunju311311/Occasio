import type { EditProfileDto } from '../../../../application/dtos/editprofile.dto';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface IEditProfileUseCase {
  execute(data: EditProfileDto): Promise<UserResponseDto | null>;
}
