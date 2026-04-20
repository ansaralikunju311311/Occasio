import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { ManageDto } from '../../../../application/dtos/manager.dto';
export interface IUserManageUseCase {
  execute(data: ManageDto): Promise<UserResponseDto | null>;
}
