import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { ResetPasswordDTO } from "../dtos/reset-password.dto.js";
import { User } from "../../domain/entites/user.entity.js";
export class ResetPasswordUseCase{

     constructor(
        private userRespository :IUserRepository,
        private hashService : IHashServive
     ){}

     async execute(data:ResetPasswordDTO):Promise<User>{

        const user = await this.userRespository.findByEmail(data.email);
        if(!user) throw new Error('the user is not found');

        if(user.otpType != UserOtp.FORGOT_PASSWORD){
            throw new Error('invalid password reset');
        }

        if(!user.otp || !user.otpExpires){
            throw new Error('otp not found')
        }

        if(user.otp != data.otp){
            throw new Error('incorrect otp')
        }
        if(user.otpExpires < new Date()){
            throw new Error('the time expire')
        }
        if(data.password != data.confirmpassword){
            throw new Error("passoword is not match")
        }
        console.log('the password',data.password)
        const hashedpassword = await this.hashService.hash(data.password);
   
        user.password = hashedpassword;
        console.log('user pass',user.password)
        user.otp = null;
        user.otpExpires =null;
        user.otpSendAt = null;
        user.otpType = null;
       

         return this.userRespository.update(user)
     }
}