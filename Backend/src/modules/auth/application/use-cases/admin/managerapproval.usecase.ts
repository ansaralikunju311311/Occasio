import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { User } from "../../../domain/entites/user.entity.js";
import { UserRole } from "../../../../../common/enums/user-role.enum.js";
import { EmailSerive } from "../../../../../common/service/email.service.js";
export class ManagerApprovalUseCase{
    constructor(
        private userRepository : IUserRepository,
        private emailService: EmailSerive
    ){}
    async execute(id:string):Promise<User | null>{

        const user = await this.userRepository.findById(id);
        console.log(user)

        if(!user) return null
            
   user.isEventManger=true;
   user.role = UserRole.EVENT_MANAGER;
   
   const updatedUser = await this.userRepository.update(user);
   
   if (updatedUser) {
       await this.emailService.sendApprovalEmail(updatedUser.email, updatedUser.name);
   }
   
   return updatedUser;
        
        }
    }
