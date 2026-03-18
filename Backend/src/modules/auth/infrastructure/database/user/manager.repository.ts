import { EventManager } from "../../../domain/entites/manager.entity.js";
import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";

import { EventManagerModel } from "../event_manager.model.js";


export class managerRepository implements IEventManagerRepository{



    async create(user: EventManager): Promise<EventManager> {


        console.log("fgjnfkjgfjsrg   checking create")
        
         const created = await EventManagerModel.create({
            userId:user.userId,
            fullName:user.fullName,
             certificate:user.certificate,
             aboutEvents:user.aboutEvents,
             organizationType:user.organizationType,
             socialLinks:user.socialLinks,
             experienceLevel:user.experienceLevel,
             documentReference:user.documentReference,
             organizationName:user.organizationName,
            
         });
         return new EventManager(
             created._id.toString(),
             created.fullName,
             created.certificate,
             created.aboutEvents,
             created.organizationType,
             created.socialLinks,
             created.documentReference,
             created.experienceLevel,
             created.organizationName

         )

    }










}