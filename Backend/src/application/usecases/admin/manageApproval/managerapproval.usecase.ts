import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { UserRole } from '../../../../common/enums/userrole-enum';
import { EmailSerive } from '../../../../common/services/email.service';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
import { IApprovalUseCase } from './managerapproval.usecase.interface';
export class ManagerApprovalUseCase implements IApprovalUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: EmailSerive,
  ) {}
  async execute(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByIdUser(id);
    console.log(user);

    if (!user) return null;

    user.role = UserRole.EVENT_MANAGER;
    user.rejectedAt = null;
    user.applyingupgrade = UpgradeStatus.APPROVED;
    const updatedUser = await this.userRepository.updateUser(user);

    if (updatedUser) {
      await this.emailService.sendApprovalEmail(
        updatedUser.email,
        updatedUser.name,
      );
    }

    return updatedUser ? userMapper.toResponse(updatedUser) : null;
  }
}
