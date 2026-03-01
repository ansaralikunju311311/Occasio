import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { generateOTP } from "../../../../common/utils/generate-otp.js";
import { User } from "../../domain/entites/user.entity.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";

export class ResendotpUseCase{
    constructor(
        private  userRepository :IUserRepository
    ){}




    async execute (email:string):Promise<User>{
        const user = await this.userRepository.findByEmail(email);


        console.log('user',user)
        if(!user){
            throw new Error('user is not exist register first')
        }
        if(user.isVerfied === true && user.otpType === UserOtp.SIGNUP){
            throw new Error('user is already verified')
        }
       const now = new Date();
      console.log("the time now ",now);
       if(user.otpSendAt){
          console.log("for checking",now.getTime());
          console.log("otpsendtime",user.otpSendAt.getTime())
        const diff  =  ((now.getTime() - user.otpSendAt.getTime()) / 1000);

         console.log("the diff",diff)

         if(diff < 60){
            throw new Error('please wait')
         }
       }

       const  newOtp = generateOTP();
       console.log('generated',newOtp)
       user.otp = newOtp;
       user.otpExpires = new Date(now.getTime() + 1 * 60 * 1000);
       user.otpType = user.otpType,
       user.otpSendAt= now

        return this.userRepository.update(user)
    }
}