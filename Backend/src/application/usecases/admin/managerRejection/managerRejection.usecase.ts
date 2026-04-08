import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { EmailSerive } from '../../../../common/services/email.service';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
export class ManagerRejectionUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: EmailSerive,
  ) {}
  async execute(id: string, reason?: string): Promise<User | null> {
    const user = await this.userRepository.findByIdUser(id);
    console.log('user', user);
    if (!user) return null;

    user.rejectedAt = new Date();
    user.reapplyAt = new Date(Date.now() + 60 * 1000); // 1 minute cooldown
    user.applyingupgrade = UpgradeStatus.REJECTED;
    const updatedUser = await this.userRepository.updateUser(user);

    if (updatedUser) {
      await this.emailService.sendRejectionEmail(
        updatedUser.email,
        updatedUser.name,
        reason,
      );
    }

    return updatedUser;
  }
}
