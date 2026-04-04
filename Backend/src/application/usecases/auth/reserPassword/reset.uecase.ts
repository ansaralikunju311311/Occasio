import { UserOtp } from "../../../../common/enums/userotp-enum";
import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { IHashServive } from "../../../../domain/services/hash.service.interface";
import { ResetPasswordDTO } from "../../../dtos/reset.dto";
import { User } from "../../../../domain/entities/user.entity";
import { AppError } from "../../../../common/errors/apperror";
import { HttpStatus } from "../../../../common/constants/http-status";
import { ErrorMessage } from "../../../../common/enums/message-enum";
import { IOtpRepository } from "domain/repositories/otp.repository.interface";
export class ResetPasswordUseCase{

     constructor(
        private userRespository :IUserRepository,
        private hashService : IHashServive,
        private otpRepository: IOtpRepository
     ){}

     async execute(data:ResetPasswordDTO):Promise<User>{

        const user = await this.userRespository.findByEmail(data.email);
        if(!user) throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.NOT_FOUND);

        const otpUser = await this.otpRepository.MatchOTP({ email: data.email, otp: data.otp });

        if(!otpUser){
            throw new AppError(ErrorMessage.INCORRECT_OTP,HttpStatus.UNAUTHORIZED);
        }

        if(otpUser.otpType != UserOtp.FORGOT_PASSWORD){
            throw new AppError(ErrorMessage.INVALID_PASSWORD_RESET,HttpStatus.BAD_REQUEST);
        }

        if(!otpUser.otp || !otpUser.otpExpires){
            throw new AppError(ErrorMessage.NO_OTP_FOUND,HttpStatus.BAD_REQUEST)
        }

        if(otpUser.otp != data.otp){
            throw new AppError(ErrorMessage.INCORRECT_OTP,HttpStatus.UNAUTHORIZED)
        }
        if(otpUser.otpExpires < new Date()){
            throw new AppError(ErrorMessage.OTP_EXPIRED,HttpStatus.GONE)
        }
        if(data.password != data.confirmpassword){
            throw new AppError(ErrorMessage.PASSWORD_MISMATCH,HttpStatus.BAD_REQUEST)
        }
        console.log('the password',data.password)
        const hashedpassword = await this.hashService.hash(data.password);
   
        user.password = hashedpassword;
        console.log('user pass',user.password)
        
        otpUser.isUsed = true;
        await this.otpRepository.otpStore(otpUser);

         return this.userRespository.updateUser(user)
     }
}