import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import type { EmailSerive } from '../../../../common/services/email.service';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';

import type { IManagerRejectionUseCase } from './managerRejection.usecase.interface';
export class ManagerRejectionUseCase implements IManagerRejectionUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _emailService: EmailSerive,
  ) {}
  async execute(id: string, reason?: string): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findByIdUser(id);
    if (!user) {
      return null;
    }

    user.rejectedAt = new Date();
    user.reapplyAt = new Date(Date.now() + 60 * 1000); // 1 minute cooldown
    user.applyingupgrade = UpgradeStatus.REJECTED;
    const updatedUser = await this._userRepository.updateUser(user);

    if (updatedUser) {
      await this._emailService.sendRejectionEmail(
        updatedUser.email,
        updatedUser.name,
        reason,
      );
    }

    return updatedUser ? userMapper.toResponse(updatedUser) : null;
  }
}
