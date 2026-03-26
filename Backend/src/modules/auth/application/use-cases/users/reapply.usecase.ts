import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { AppError } from "../../../../../common/errors/app-error.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { UserStatus } from "../../../../../common/enums/user-status.enum.js";
import { UpgradeStatus } from "../../../../../common/enums/upgrade.enum.js";
export class ReapplyUseCase {
    constructor(
        private userRepository: IUserRepository
    ) { }



    async execute(userId: string) {
        console.log(userId);


        const user = await this.userRepository.findById(userId);
        console.log(user)

        if (!user) {
            throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (user.status == UserStatus.BLOCK) {
            throw new AppError(ErrorMessage.ACCOUNT_BLOCKED, HttpStatus.UNAUTHORIZED)
        }

        // const now = new Date()

        // const rejectedTime = new Date(user.rejectedAt);
        // const diffInMinutes =
        //     (now.getTime() - rejectedTime.getTime()) / (1000 * 60);

        // if (diffInMinutes < 1) {
        //     throw new Error(`You can reapply after 1 minute.`);
        // }

        // const updatedUser = await this.userRepository.update(email, {
        //       applyingupgrade: UpgradeStatus.PENDING
        //       rejectedAt: null
        //     });

        if (user.reapplyAt && new Date() < user.reapplyAt) {
            throw new Error(`You must wait before reapplying.`);
        }

        user.applyingupgrade = UpgradeStatus.NONE;
        user.rejectedAt = null;
        user.reapplyAt = null;
        const updated = await this.userRepository.updateOne(user)


        return updated

    }


}