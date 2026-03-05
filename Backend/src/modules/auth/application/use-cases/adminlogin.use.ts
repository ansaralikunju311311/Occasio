import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { User } from "../../domain/entites/user.entity.js";
import { HttpStatus } from "../../../../common/constants/http-stattus.js";
import { AppError } from "../../../../common/errors/app-error.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
import { AdminLoginDto } from "../dtos/adminlogin.dto.js";
export class AdminLoginUseCase{


    constructor(
        private userRepository : IUserRepository,
        private compareService :IHashServive
    ){}


  async execute (data:AdminLoginDto):Promise<User>{
       console.log(data.role)
     const user = await this.userRepository.findByEmail(data.email)
   
    //    console.log(value)
  console.log("user",user)
     if(!user){
          throw new AppError('user not exist',HttpStatus.NOT_FOUND)
         }
        
          if(user.role != UserRole.ADMIN){
            console.log("user.role",user.role)
            throw new AppError('NO permission Only Admin',HttpStatus.UNAUTHORIZED)
        }
         const isMatch = await this.compareService.comapre(data.password,user.password)
     
         if(!isMatch){
         throw new AppError('the passowrd is not matching',HttpStatus.UNAUTHORIZED)
        }
     
        if(user.isVerified === false){
         throw new AppError('verifiy user account correctly',HttpStatus.FORBIDDEN)
        }
     
        if(user.status === UserStatus.BLOCK){
          throw new AppError('the user is not permitted because your blocked',HttpStatus.UNAUTHORIZED)
        }

       
        return user

  }
  
}