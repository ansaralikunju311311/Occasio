import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { ManageDto } from '../../../dtos/manager.dto';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserStatus } from '../../../../common/enums/userstatus-enum';
import { IUserManageUseCase } from './usermanage.usecase.interface';
export class UserManageUseCase implements IUserManageUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(data: ManageDto): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findByIdUser(data.userId);

    if (!user) return null;

    user.status = data.status as UserStatus;
    const updatedUser = await this._userRepository.updateUser(user);
    return updatedUser ? userMapper.toResponse(updatedUser) : null;
  }
}
