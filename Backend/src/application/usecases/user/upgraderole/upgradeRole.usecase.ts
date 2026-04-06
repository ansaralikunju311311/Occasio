import { User } from "../../../../domain/entities/user.entity";
import { IEventManagerRepository } from "../../../../domain/repositories/manger.repository.interface";
import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { UpgraderoleDto } from "../../../dtos/upgraderole.dto";
import { EventManager } from "../../../../domain/entities/manager.entity";
import { UpgradeStatus } from "../../../../common/enums/upgrade-enums";
import { IUpgradeUseCase } from "./upgaradeRole.usecase.interface";

export class UpgradeUseCase implements IUpgradeUseCase {
    constructor(
        private userRepository: IUserRepository,
        private managerRepository: IEventManagerRepository
    ) { }

    async execute(data: UpgraderoleDto): Promise< User | null> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user || !user.id) return null;



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