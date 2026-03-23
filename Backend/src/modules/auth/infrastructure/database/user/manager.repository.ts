import { EventManager } from "../../../domain/entites/manager.entity.js";
import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";

import { EventManagerModel } from "../event_manager.model.js";


export class ManagerRepository implements IEventManagerRepository {



    async create(user: EventManager): Promise<EventManager> {


        console.log("fgjnfkjgfjsrg   checking create")

        const created = await EventManagerModel.create({
            userId: user.userId,
            fullName: user.fullName,
            certificate: user.certificate,
            aboutEvents: user.aboutEvents,
            organizationType: user.organizationType,
            socialLinks: user.socialLinks,
            experienceLevel: user.experienceLevel,
            documentReference: user.documentReference,
            organizationName: user.organizationName,

        });
        return new EventManager(
            created._id.toString(),
            created.userId.toString(),
            created.fullName,
            created.organizationName,
            created.aboutEvents,
            created.certificate,
            created.documentReference,
            created.experienceLevel,
            created.socialLinks,
            created.organizationType
        )

    }
    async findOne(userId: string): Promise<EventManager | null> {
        console.log("userId kittya", userId)
        const user = await EventManagerModel.findOne({ userId: userId });
        console.log("user kittya evidunnn", user)
        if (!user) return null
        return new EventManager(
            user._id.toString(),
            user.userId.toString(),
            user.fullName,
            user.organizationName,
            user.aboutEvents,
            user.certificate,
            user.documentReference,
            user.experienceLevel,
            user.socialLinks,
            user.organizationType
        )

    }

}



