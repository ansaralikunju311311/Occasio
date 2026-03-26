import { UserOtp } from "../../../../../common/enums/user-otp.enum.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { IHashServive } from "../../../domain/services/hash.service.interface.js";
import { ResetPasswordDTO } from "../../dtos/reset-password.dto.js";
import { User } from "../../../domain/entites/user.entity.js";
import { AppError } from "../../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";
export class ResetPasswordUseCase{

     constructor(
        private userRespository :IUserRepository,
        private hashService : IHashServive
     ){}

     async execute(data:ResetPasswordDTO):Promise<User>{

        const user = await this.userRespository.findByEmail(data.email);
        if(!user) throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.NOT_FOUND);

        if(user.otpType != UserOtp.FORGOT_PASSWORD){
            throw new AppError(ErrorMessage.INVALID_PASSWORD_RESET,HttpStatus.BAD_REQUEST);
        }

        if(!user.otp || !user.otpExpires){
            throw new AppError(ErrorMessage.NO_OTP_FOUND,HttpStatus.BAD_REQUEST)
        }

        if(user.otp != data.otp){
            throw new AppError(ErrorMessage.INCORRECT_OTP,HttpStatus.UNAUTHORIZED)
        }
        if(user.otpExpires < new Date()){
            throw new AppError(ErrorMessage.OTP_EXPIRED,HttpStatus.GONE)
        }
        if(data.password != data.confirmpassword){
            throw new AppError(ErrorMessage.PASSWORD_MISMATCH,HttpStatus.BAD_REQUEST)
        }
        console.log('the password',data.password)
        const hashedpassword = await this.hashService.hash(data.password);
   
        user.password = hashedpassword;
        console.log('user pass',user.password)
        user.otp = null;
        user.otpExpires =null;
        user.otpSendAt = null;
        user.otpType = null;
       

         return this.userRespository.updateOne(user)
     }
}