import { User } from "../../../domain/entites/user.entity.js";
import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { UpgraderoleDto } from "../../dtos/upgraderole.dto.js";
import { EventManager } from "../../../domain/entites/manager.entity.js";

export class UpgradeUseCase{
    constructor(
        private userRepository :IUserRepository,
        private managerRepository : IEventManagerRepository
    ){}

    async execute(data:UpgraderoleDto):Promise<EventManager | User | null>{
         const user = await this.userRepository.findByEmail(data.email);

         if(!user) return null;



         console.log("lvefjnjvjsfv");

        //    const newUser = new User(
        //                             user.id,
        //                             user.name,
        //                             user.email,
        //                             user.password,
        //                             user.role,
        //                             user.status,
        //                             user.isVerified,
        //                             user.otp =null,
        //                             user.otpExpires =null,
        //                             user.otpType=null,
        //                             user.otpSendAt = null,
        //                             user.isEventManger,
        //                             user.applyingupgrade=true,
                                    
        //                         );



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


       await this.managerRepository.create(request)

       user.applyingupgrade=true;
         // Add your upgrade logic here, for now just return the user
         return this.userRepository.update(user)
    }
}