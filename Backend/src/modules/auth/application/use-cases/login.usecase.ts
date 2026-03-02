import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { LoginDto } from "../dtos/login.dto.js";
import { User } from "../../domain/entites/user.entity.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
import { AppError } from "../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../common/constants/http-stattus.js";
export class LoginUseCase{
    constructor(
        private userRepository:IUserRepository,
        private compareService :IHashServive
    ){}

   async execute(data:LoginDto):Promise<User>{
    const user = await this.userRepository.findByEmail(data.email)

    if(!user){
     throw new AppError('user not exist',HttpStatus.NOT_FOUND)
    }
    const isMatch = await this.compareService.comapre(data.password,user.password)

    if(!isMatch){
    throw new AppError('the passowrd is not matching',HttpStatus.UNAUTHORIZED)
   }

   if(user.isVerfied === false){
    throw new AppError('verifiy user account correctly',HttpStatus.FORBIDDEN)
   }

   if(user.status === UserStatus.BLOCK){
     throw new AppError('the user is not permitted because your blocked',HttpStatus.UNAUTHORIZED)
   }
    
    //  console.log("for the login setup",user)

     return user
   }
   


}