import { IHashServive } from "../../../../domain/services/hash.service.interface";
import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { LoginDto } from "../../../dtos/login.dto";
import { UserStatus } from "../../../../common/enums/userstatus-enum";
import { AppError } from "../../../../common/errors/apperror";
import { HttpStatus } from "../../../../common/constants/http-status";
import { ITokenService } from "../../../../domain/services/token.service.interface";
import { LoginResponseDto } from "../../../dtos/loginResponse.dto";
import { ErrorMessage } from "../../../../common/enums/message-enum";
import { ILoginUsecase } from "./login.usecase.interface";
export class LoginUseCase implements ILoginUsecase{
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
    userId: user.id,
    role: user.role
  })

  return {
    user,
    accessToken,
    refreshToken
  }

}
}