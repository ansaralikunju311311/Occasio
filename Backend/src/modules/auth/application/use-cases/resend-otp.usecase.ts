import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { generateOTP } from "../../../../common/utils/generate-otp.js";
import { User } from "../../domain/entites/user.entity.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { AppError } from "../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../common/constants/http-stattus.js";
import { EmailSerive } from "../../../../common/service/email.service.js";

export class ResendotpUseCase{
    constructor(
        private  userRepository :IUserRepository,
        private emailService : EmailSerive
    ){}




    async execute (email:string):Promise<User>{
        const user = await this.userRepository.findByEmail(email);


        console.log('user',user)
        if(!user){
            throw new AppError('user is not exist register first',HttpStatus.UNAUTHORIZED)
        }
        if(user.isVerified === true && user.otpType === UserOtp.SIGNUP){
            throw new AppError('user is already verified',HttpStatus.CONFLICT)
        }
       const now = new Date();
      console.log("the time now ",now);
       if(user.otpSendAt){
          console.log("for checking",now.getTime());
          console.log("otpsendtime",user.otpSendAt.getTime())
        const diff  =  ((now.getTime() - user.otpSendAt.getTime()) / 1000);

         console.log("the diff",diff)

         if(diff < 60){
            throw new AppError('please wait',HttpStatus.MANY_REQUEST)
         }
       }

       const  newOtp = generateOTP();
       console.log('generated',newOtp)
       user.otp = newOtp;
       user.otpExpires = new Date(now.getTime() + 1 * 60 * 1000);
       user.otpType = user.otpType,
       user.otpSendAt= now
          await this.emailService.sendOtpEmail(user.email,newOtp)
        return this.userRepository.update(user)
    }
}