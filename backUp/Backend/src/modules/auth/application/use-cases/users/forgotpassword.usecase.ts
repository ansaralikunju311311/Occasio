import { AppError } from "../../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { UserStatus } from "../../../../../common/enums/user-status.enum.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { generateOTP } from "../../../../../common/utils/generate-otp.js";
import { User } from "../../../domain/entites/user.entity.js";
import { UserOtp } from "../../../../../common/enums/user-otp.enum.js";
import { EmailSerive } from "../../../../../common/service/email.service.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";
export class ForgotpasswordUsecase {
    constructor(
        private userRepository :IUserRepository,
        private emailService :EmailSerive
    ){}
    async execute(email:string):Promise<User>{



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


             const otpSendAt = new Date()
           const otp = generateOTP();
        
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            await this.emailService.sendOtpEmail(data.email,otp)
     const newUser = new User(
                        data.id,
                        data.name,
                        data.email,
                        data.password,
                        data.role,
                        data.status,
                        data.isVerified,
                        otp,
                        otpExpires,
                        UserOtp.FORGOT_PASSWORD,
                        otpSendAt,
                        data.applyingupgrade,
                        data.rejectedAt,
                        data.reapplyAt

                        
                    );
            

        
                    return this.userRepository.updateUser(newUser)
            
    }
}