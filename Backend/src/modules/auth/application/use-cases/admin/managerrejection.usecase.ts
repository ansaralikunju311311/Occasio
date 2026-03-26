import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { User } from "../../../domain/entites/user.entity.js";
import { EmailSerive } from "../../../../../common/service/email.service.js";
import { UpgradeStatus } from "../../../../../common/enums/upgrade.enum.js";
export class ManagerRejectionUseCase {
    constructor(
        private userRepository: IUserRepository,
        private emailService: EmailSerive
    ) { }
    async execute(id: string, reason?: string): Promise<User | null> {

        const user = await this.userRepository.findById(id);
        console.log("user", user);
        if (!user) return null

        user.rejectedAt = new Date();
        user.reapplyAt = new Date(Date.now() + 60 * 1000); // 1 minute cooldown
        user.applyingupgrade = UpgradeStatus.REJECTED;
        const updatedUser = await this.userRepository.updateOne(user);
        
        if (updatedUser) {
            await this.emailService.sendRejectionEmail(updatedUser.email, updatedUser.name, reason);
        }

        return updatedUser;
    }
}
