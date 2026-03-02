import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { ResetPasswordDTO } from "../dtos/reset-password.dto.js";
import { User } from "../../domain/entites/user.entity.js";
import { AppError } from "../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../common/constants/http-stattus.js";
export class ResetPasswordUseCase{

     constructor(
        private userRespository :IUserRepository,
        private hashService : IHashServive
     ){}

     async execute(data:ResetPasswordDTO):Promise<User>{

        const user = await this.userRespository.findByEmail(data.email);
        if(!user) throw new AppError('the user is not found',HttpStatus.NOT_FOUND);

        if(user.otpType != UserOtp.FORGOT_PASSWORD){
            throw new AppError('invalid password reset',HttpStatus.BAD_REQUEST);
        }

        if(!user.otp || !user.otpExpires){
            throw new AppError('otp not found',HttpStatus.BAD_REQUEST)
        }

        if(user.otp != data.otp){
            throw new AppError('incorrect otp',HttpStatus.UNAUTHORIZED)
        }
        if(user.otpExpires < new Date()){
            throw new AppError('the time expire',HttpStatus.GONE)
        }
        if(data.password != data.confirmpassword){
            throw new AppError("passoword is not match",HttpStatus.BAD_REQUEST)
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