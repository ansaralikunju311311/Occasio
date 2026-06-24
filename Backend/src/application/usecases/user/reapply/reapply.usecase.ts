import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { AppError } from '../../../../common/errors/apperror';
import { ErrorMessage } from '../../../../common/enums/message-enum';
import { HttpStatus } from '../../../../common/constants/http-status';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserStatus } from '../../../../common/enums/userstatus-enum';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';

import type { IReapplyUseCase } from './reapply.usecase.interface';
export class ReapplyUseCase implements IReapplyUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findByIdUser(userId);

    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCK) {
      throw new AppError(ErrorMessage.ACCOUNT_BLOCKED, HttpStatus.UNAUTHORIZED);
    }
    if (user.reapplyAt && new Date() < user.reapplyAt) {
      throw new Error(`You must wait before reapplying.`);
    }

    user.applyingupgrade = UpgradeStatus.NONE;
    user.rejectedAt = null;
    user.reapplyAt = null;
    const updated = await this._userRepository.updateUser(user);
    return updated ? userMapper.toResponse(updated) : null;
  }
}
