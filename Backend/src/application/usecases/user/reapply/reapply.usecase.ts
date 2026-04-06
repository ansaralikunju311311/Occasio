import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { AppError } from "../../../../common/errors/apperror";
import { ErrorMessage } from "../../../../common/enums/message-enum";
import { HttpStatus } from "../../../../common/constants/http-status";
import { UserStatus } from "../../../../common/enums/userstatus-enum";
import { UpgradeStatus } from "../../../../common/enums/upgrade-enums";
import { User } from "../../../../domain/entities/user.entity";
import { IReapplyUseCase } from "./reapply.usecase.interface";
export class ReapplyUseCase implements IReapplyUseCase {
    constructor(
        private userRepository: IUserRepository
    ) { }



    async execute(userId: string):Promise<User | null> {
        console.log(userId);


        const user = await this.userRepository.findByIdUser(userId);
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
        const updated = await this.userRepository.updateUser(user)


        return updated

    }


}