import { EditProfileDto } from '../../../../application/dtos/editprofile.dto';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface IEditProfileUseCase {
  execute(data: EditProfileDto): Promise<UserResponseDto | null>;
}
