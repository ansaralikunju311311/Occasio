import { IHashServive } from "../../../domain/services/hash.service.interface.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { LoginDto } from "../../dtos/login.dto.js";
import { UserStatus } from "../../../../../common/enums/user-status.enum.js";
import { AppError } from "../../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { ITokenService } from "../../../domain/services/token.service.interface.js";
import { LoginResponseDto } from "../../dtos/loginResponse.dto.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";
export class LoginUseCase{
    constructor(
        private userRepository:IUserRepository,
        private compareService :IHashServive,
        private tokenService :ITokenService


    ){}
  
   async execute(data:LoginDto):Promise<LoginResponseDto>{


    const user = await this.userRepository.findByEmail(data.email)
     
    if(!user){
     throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.NOT_FOUND)
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
    userId:user.id
  })

  return {
    user,
    accessToken,
    refreshToken
  }

}
}