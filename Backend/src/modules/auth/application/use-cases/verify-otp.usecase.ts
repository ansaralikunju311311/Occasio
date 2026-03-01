import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { VerfiyOtpDto } from "../dtos/verify-otp.dto.js";
import { User } from "../../domain/entites/user.entity.js";
export class VerifyUseCase{
    constructor(
        private userRepository :IUserRepository
    ){}


    async execute(data:VerfiyOtpDto):Promise<User>{


        const user = await this.userRepository.findByEmail(data.email);
        if(!user){
            throw new Error('the user is not exist their')
        }
        console.log("fjnjfnvfj",user)

        if(!user.otp || !user.otpExpires){
               throw new Error('no otp here')
        }
        if(user.otp != data.otp){
            throw new Error('incorrect otp')
        }
        if(user.otpExpires < new Date() ){
            throw new Error('time expired')
        }

        
        user.isVerfied = true,
        user.otp = null,
        user.otpExpires = null,
        user.otpType = null,
        user.otpSendAt = null

    
        return  this.userRepository.update(user)
    }
}