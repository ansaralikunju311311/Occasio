import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { IHashServive } from "../../../../domain/services/hash.service.interface";

import { HttpStatus } from "../../../../common/constants/http-status";
import { AppError } from "../../../../common/errors/apperror";
import { UserStatus } from "../../../../common/enums/userstatus-enum";
import { UserRole } from "../../../../common/enums/userrole-enum";
// import { AdminLoginDto } from "../../dtos/adminlogin.dto.js";
import { LoginDto } from "../../../../application/dtos/login.dto";
import { LoginResponseDto } from "../../../dtos/loginResponse.dto";
 import { ITokenService } from "../../../../domain/services/token.service.interface";
 import { ErrorMessage } from "../../../../common/enums/message-enum";
import { ILoginUsecase } from "../login/login.usecase.interface";
export class AdminLoginUseCase implements ILoginUsecase{


    constructor(
        private userRepository : IUserRepository,
        private compareService :IHashServive,
         private tokenService :ITokenService
    ){}


  async execute (data:LoginDto):Promise<LoginResponseDto>{
    //    console.log(data.role)
     const user = await this.userRepository.findByEmail(data.email)
   
    //    console.log(value)
  console.log("user",user)
     if(!user){
          throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.NOT_FOUND)
         }
        
          if(user.role != UserRole.ADMIN){
            console.log("user.role",user.role)
            throw new AppError(ErrorMessage.NO_PERMISSION_ADMIN,HttpStatus.UNAUTHORIZED)
        }
         const isMatch = await this.compareService.comapre(data.password,user.password)
     
         if(!isMatch){
         throw new AppError(ErrorMessage.INCORRECT_PASSWORD,HttpStatus.UNAUTHORIZED)
        }
     
        if(user.isVerified === false){
         throw new AppError(ErrorMessage.ACCOUNT_NOT_VERIFIED,HttpStatus.FORBIDDEN)
        }
     
        if(user.status === UserStatus.BLOCK){
          throw new AppError(ErrorMessage.ACCOUNT_BLOCKED,HttpStatus.UNAUTHORIZED)
        }
     



      const accessToken =  this.tokenService.generateAccessToken({
  userId: user.id,
  role: user.role
})

  const refreshToken = this.tokenService.generateRefreshToken({
    userId: user.id,
    role: user.role
  })


  // console.log("refresf",refreshToken);
  // console.log("access",accessToken)
       
        return {user,accessToken,refreshToken}
        //   accessToken,
        //   refreshToken
        // }

  }
  
}