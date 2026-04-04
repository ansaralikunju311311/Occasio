import { AppError } from "../../../../common/errors/apperror";
import { HttpStatus } from "../../../../common/constants/http-status";
import { UserStatus } from "../../../../common/enums/userstatus-enum";
import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { generateOTP } from "../../../../common/utils/generateotp";
import { User } from "../../../../domain/entities/user.entity";
import { UserOtp } from "../../../../common/enums/userotp-enum";
import { EmailSerive } from "../../../../common/services/email.service";
import { ErrorMessage } from "../../../../common/enums/message-enum";
import { IOtpRepository } from "domain/repositories/otp.repository.interface";
import { OTP } from "domain/entities/otp.entity";
import { IForgotpasswordUsecase } from "./forgot.usecase.interface";
export class ForgotpasswordUsecase implements IForgotpasswordUsecase{
    constructor(
        private userRepository :IUserRepository,
        private emailService :EmailSerive,
        private otpRepository:IOtpRepository
    ){}
    async execute(email:string):Promise<OTP | null>{


    
        const data = await this.userRepository.findByEmail(email)


            if(!data){
                throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.NOT_FOUND)
            }

            if(data.isVerified  == false){
                throw new AppError(ErrorMessage.ACCOUNT_NOT_VERIFIED,HttpStatus.FORBIDDEN)
            }
            if(data.status == UserStatus.BLOCK){
                 throw new AppError(ErrorMessage.ACCOUNT_BLOCKED,HttpStatus.FORBIDDEN)
            }


             
           const otp = generateOTP();
        
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            await this.emailService.sendOtpEmail(data.email,otp)
            const otpSendAt = new Date()
             const isUsed = false;
             const otpType = UserOtp.FORGOT_PASSWORD
             
            //     public email:string,
    //       public otp: string,
    //  public otpExpires: Date,
    //  public otpType: UserOtp,
    //   public isUsed:boolean,
    //  public otpSendAt: Date,
     const newUser = new OTP(
                        // data.id,
                        // data.name,
                        // data.email,
                        // data.password,
                        // data.role,
                        // data.status,
                        // data.isVerified,
                        // otp,
                        // otpExpires,
                        // UserOtp.FORGOT_PASSWORD,
                        // otpSendAt,
                        // data.applyingupgrade,
                        // data.rejectedAt,
                        // data.reapplyAt
                           null,
                            data.email,
                            otp,
                            otpExpires,
                            otpType,
                            isUsed,
                            otpSendAt,



                        
                    );
            

        
                  return this.otpRepository.otpStore(newUser)
            
    }
}