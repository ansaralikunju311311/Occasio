import { User } from "../../../domain/entites/user.entity.js";
import { ManageDto } from "../../dtos/manage.dto.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { UserStatus } from "../../../../../common/enums/user-status.enum.js";
export class UserManageUseCase{
    constructor(
           
            private userRepository:IUserRepository
        ){}
    
       
    
        async execute(data:ManageDto):Promise<User | null>{


          const user = await this.userRepository.findByIdUser(data.userId)

          if(!user) return null
    
          user.status = data.status as UserStatus;
          return this.userRepository.updateUser(user)
       }
    
}