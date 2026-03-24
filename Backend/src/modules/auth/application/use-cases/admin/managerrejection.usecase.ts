import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { User } from "../../../domain/entites/user.entity.js";
import { EmailSerive } from "../../../../../common/service/email.service.js";
export class ManagerRejectionUseCase{
    constructor(
        private userRepository : IUserRepository,
        private emailService: EmailSerive
    ){}
    async execute(id:string):Promise<User | null>{

        const user = await this.userRepository.findById(id);
        console.log("user",user);
                if(!user) return null

                
            const updatedUser = await this.userRepository.update(user);
            
            if (updatedUser) {
                await this.emailService.sendRejectionEmail(updatedUser.email, updatedUser.name);
            }
            
            return updatedUser;
        }
    }
