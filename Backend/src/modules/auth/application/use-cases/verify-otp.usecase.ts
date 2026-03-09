import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { VerfiyOtpDto } from "../dtos/verify-otp.dto.js";
import { User } from "../../domain/entites/user.entity.js";
import { AppError } from "../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../common/constants/http-stattus.js";
import { ITokenService } from "../../domain/services/token.service.interface.js";
import { LoginResponseDto } from "../dtos/loginResponse.dto.js";
export class VerifyUseCase{
    constructor(
        private userRepository :IUserRepository,
         private tokenService :ITokenService
    ){}


    async execute(data:VerfiyOtpDto):Promise<LoginResponseDto>{


        console.log("body daata for the otp verifction",data)

        const user = await this.userRepository.findByEmail(data.email);
        if(!user){
            throw new AppError('the user is not exist their',HttpStatus.NOT_FOUND)
        }
        console.log("fjnjfnvfj",user)

        if(!user.otp || !user.otpExpires){
               throw new AppError('no otp here',HttpStatus.BAD_REQUEST)
        }
        if(user.otp != data.otp){
            throw new AppError('incorrect otp',HttpStatus.UNAUTHORIZED)
        }
        if(user.otpExpires < new Date() ){
             user.otp = null,
        user.otpExpires = null,
        user.otpType = null,
        user.otpSendAt = null
           await this.userRepository.update(user)
            throw new AppError('time expired',HttpStatus.GONE)
        }

        
        user.isVerified = true,
        user.otp = null,
        user.otpExpires = null,
        user.otpType = null,
        user.otpSendAt = null

        

        console.log("the passing value for the updation after the otp",user);
        console.log(user.isVerified)
        const updateUser = await this.userRepository.update(user);

        const accessToken =  this.tokenService.generateAccessToken({
            userId:updateUser.id,
            role:updateUser.role
        })
        const refreshToken =  this.tokenService.generateRefreshToken({
            userId : updateUser.id
        })


        return {user:updateUser,accessToken,refreshToken}
        //    accessToken,
        //    refreshToken


        
    }
}