import { User } from "../../../domain/entites/user.entity.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { UpgraderoleDto } from "../../dtos/upgraderole.dto.js";

export class UpgradeUseCase{
    constructor(
        private userRepository :IUserRepository
    ){}

    async execute(data:UpgraderoleDto):Promise<User|null>{
         const user = await this.userRepository.findByEmail(data.email);

         if(!user) return null;


           const newUser = new User(
                                    user.id,
                                    user.name,
                                    user.email,
                                    user.password,
                                    user.role,
                                    user.status,
                                    user.isVerified,
                                    user.otp =null,
                                    user.otpExpires =null,
                                    user.otpType=null,
                                    user.otpSendAt = null,
                                    user.isEventManger,
                                    user.applyingupgrade=true,
                                    
                                );
         // Add your upgrade logic here, for now just return the user
         return this.userRepository.update(newUser)
    }
}