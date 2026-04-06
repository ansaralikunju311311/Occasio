import { User } from "../../../../domain/entities/user.entity";
import { ManageDto } from "../../../dtos/manager.dto";
import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { UserStatus } from "../../../../common/enums/userstatus-enum";
import { IUserManageUseCase } from "./usermanage.usecase.interface";
export class UserManageUseCase implements IUserManageUseCase{
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