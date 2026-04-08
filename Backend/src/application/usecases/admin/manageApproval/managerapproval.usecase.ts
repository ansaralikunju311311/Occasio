import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { UserRole } from '../../../../common/enums/userrole-enum';
import { EmailSerive } from '../../../../common/services/email.service';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
import { IApprovalUseCase } from './managerapproval.usecase.interface';
export class ManagerApprovalUseCase implements IApprovalUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: EmailSerive,
  ) {}
  async execute(id: string): Promise<User | null> {
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

    return updatedUser;
  }
}
