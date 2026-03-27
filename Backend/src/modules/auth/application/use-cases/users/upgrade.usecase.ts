import { User } from "../../../domain/entites/user.entity.js";
import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { UpgraderoleDto } from "../../dtos/upgraderole.dto.js";
import { EventManager } from "../../../domain/entites/manager.entity.js";
import { UpgradeStatus } from "../../../../../common/enums/upgrade.enum.js";

export class UpgradeUseCase {
    constructor(
        private userRepository: IUserRepository,
        private managerRepository: IEventManagerRepository
    ) { }

    async execute(data: UpgraderoleDto): Promise<EventManager | User | null> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) return null;



        console.log("lvefjnjvjsfv");



        const request = new EventManager(
            null,
            user.id,
            data.fullName,
            data.organizationName,
            data.aboutEvents,
            data.certificate,
            data.documentReference,
            data.experienceLevel,
            data.socialLinks,
            data.organizationType
        );


        console.log("cheking for tthe request")


        await this.managerRepository.createManager(request)

        user.applyingupgrade = UpgradeStatus.PENDING;
        // Add your upgrade logic here, for now just return the user
        return this.userRepository.updateUser(user)
    }
}