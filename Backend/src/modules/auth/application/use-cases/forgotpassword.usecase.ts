import { AppError } from "../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../common/constants/http-stattus.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { generateOTP } from "../../../../common/utils/generate-otp.js";
import { User } from "../../domain/entites/user.entity.js";
import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { EmailSerive } from "../../../../common/service/email.service.js";
export class ForgotpasswordUsecase {
    constructor(
        private userRepository :IUserRepository,
        private emailService :EmailSerive
    ){}



    async execute(email:string):Promise<User>{



        const data = await this.userRepository.findByEmail(email)


            if(!data){
                throw new AppError('the register the first',HttpStatus.NOT_FOUND)
            }

            if(data.isVerified  == false){
                throw new AppError('Please verify your account first',HttpStatus.FORBIDDEN)
            }
            if(data.status == UserStatus.BLOCK){
                 throw new AppError(' this is the bloced user',HttpStatus.FORBIDDEN)
            }


             let otpSendAt = new Date()
           let otp = generateOTP();
        
            const otpExpires = new Date(Date.now() + 1 * 60 * 1000);
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
                        otpSendAt
                        
                    );
            

        
                    return this.userRepository.update(newUser)
            
    }
}