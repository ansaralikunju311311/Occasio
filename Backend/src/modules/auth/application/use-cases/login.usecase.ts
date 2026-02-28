import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { LoginDto } from "../dtos/login.dto.js";
import { User } from "../../domain/entites/user.entity.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
export class LoginUseCase{
    constructor(
        private userRepository:IUserRepository,
        private compareService :IHashServive
    ){}

   async execute(data:LoginDto):Promise<User>{
    const user = await this.userRepository.findByEmail(data.email)

    if(!user){
     throw new Error('user not exist')
    }
    const isMatch = await this.compareService.comapre(data.password,user.password)

    if(!isMatch){
    throw new Error('the passowrd is not matching')
   }

   if(user.isVerfied === false){
    throw new Error('verifiy user account correctly')
   }

   if(user.status === UserStatus.BLOCK){
     throw new Error('the user is not permitted because your blocked')
   }
    
    //  console.log("for the login setup",user)

     return user
   }
   


}