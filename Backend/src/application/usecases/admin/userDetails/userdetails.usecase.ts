import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';

import type { IUserdetailsUseCase } from './userdetails.usecase.interface';

export class UserDetailsUseCase implements IUserdetailsUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findByIdUser(userId);
    if (!user) {
      return null;
    }

    return userMapper.toResponse(user);
  }
}
