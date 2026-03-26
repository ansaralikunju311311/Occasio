import { UserOtp } from "../../../../../common/enums/user-otp.enum.js";
import { generateOTP } from "../../../../../common/utils/generate-otp.js";
import { User } from "../../../domain/entites/user.entity.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { AppError } from "../../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { EmailSerive } from "../../../../../common/service/email.service.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";

export class ResendotpUseCase{
    constructor(
        private  userRepository :IUserRepository,
        private emailService : EmailSerive
    ){}




    async execute (email:string):Promise<User>{
        const user = await this.userRepository.findByEmail(email);


        console.log('user',user)
        if(!user){
            throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.UNAUTHORIZED)
        }
        if(user.isVerified === true && user.otpType === UserOtp.SIGNUP){
            throw new AppError(ErrorMessage.USER_ALREADY_EXISTS,HttpStatus.CONFLICT)
        }
       const now = new Date();
      console.log("the time now ",now);
       if(user.otpSendAt){
          console.log("for checking",now.getTime());
          console.log("otpsendtime",user.otpSendAt.getTime())
        const diff  =  ((now.getTime() - user.otpSendAt.getTime()) / 1000);

         console.log("the diff",diff)

         if(diff < 60){
            throw new AppError(ErrorMessage.WAIT_ONE_MINUTE,HttpStatus.MANY_REQUEST)
         }
       }
       const  newOtp = generateOTP();
       console.log('generated',newOtp)
       user.otp = newOtp;
       user.otpExpires = new Date(now.getTime() + 5 * 60 * 1000);
       user.otpType = user.otpType,
       user.otpSendAt= now
          await this.emailService.sendOtpEmail(user.email,newOtp)
        return this.userRepository.updateUser(user)
    }
}