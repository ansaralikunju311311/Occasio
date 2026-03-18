import { IAdminRepository } from "../../../domain/repositories/admin/admin.repository.interface.js"
import { User } from "../../../domain/entites/user.entity.js";
import { ManageDto } from "../../dtos/manage.dto.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
export class UserManageUseCase{
    constructor(
           
            private userRepository:IUserRepository
        ){}
    
       
    
        async execute(data:ManageDto):Promise<User | null>{


          const user = await this.userRepository.findById(data.userId)

          if(!user) return null
    
          user.status = data.status;
          return this.userRepository.update(user)
       }
    
}