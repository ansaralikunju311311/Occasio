import { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { IHashServive } from "../../../domain/services/hash.service.interface.js";
import { signupDTO } from "../../dtos/signup.dto.js";
import { User } from "../../../domain/entities/user.entity.js";
import { UserRole } from "../../../common/enums/userrole-enum.js";
import { UserStatus } from "../../../common/enums/userstatus-enum.js";
// import { UserOtp } from "../../../../../common/enums/user-otp.enum.js";
import { generateOTP } from "../../../common/utils/generateotp";
import { AppError } from "../../../common/errors/apperror.js";
import { HttpStatus } from "../../../common/constants/http-status.js";
import { EmailSerive } from "../../../common/services/email.service";
import { ErrorMessage } from "../../../common/enums/message-enum.js";
import { UpgradeStatus } from "../../../common/enums/upgrade-enums.js";
import { ISignupUseCase } from "./signup.usecase.interface";
import { OTP } from "domain/entities/otp.entity";
import { UserOtp } from "common/enums/userotp-enum";
import { IOtpRepository } from "domain/repositories/otp.repository.interface";
export class SignupUsecase implements ISignupUseCase
{
    constructor(
        private userRepository:IUserRepository,
        private hashService :IHashServive,
        private emailService:EmailSerive,
        private otpRespository:IOtpRepository
    ){}


    async execute(data:signupDTO):Promise<User>{
        console.log("Incoming signup data:", data);
        const existingUser = await this.userRepository.findByEmail(data.email);
        if(existingUser){
            throw new AppError(ErrorMessage.USER_ALREADY_EXISTS,HttpStatus.CONFLICT)
        }
        
        if(data.confirmpassword != data.password){
            throw new AppError(ErrorMessage.PASSWORD_MISMATCH,HttpStatus.BAD_REQUEST)
        }


        const hashpassword = await this.hashService.hash(data.password)
        const role: UserRole = UserRole.USER;
        const applyingupgrade=UpgradeStatus.NONE
        // const isEventManger = false;
        const isVerified = false ;
        const  rejectedAt = null
        const reapplyAt=null
         const otpSendAt = new Date();

        const otp = generateOTP();
        
         const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
     
         const isUsed = false;
        const checkig = await this.emailService.sendOtpEmail(data.email,otp);
       
        //   email:string,
//    otp:string,
//    otpType:UserOtp,
//    otpExpires:Date,
//    isUsed:boolean,
//    otpSendAt:Date


        const Otp = new OTP(
            null,
            data.email,
            otp,
            otpExpires,
            UserOtp.SIGNUP,
              isUsed,
            otpSendAt
          
        )
        console.log("reched here",checkig)
    
        const newUser = new User(
            null,
            data.name,
            data.email,
            hashpassword,
            role,
            UserStatus.ACTIVE,
            isVerified,
            // otp,
            // otpExpires,
            // UserOtp.SIGNUP,
            // otpSendAt,
            applyingupgrade,
            rejectedAt,
            reapplyAt

        );

        const newUsers = await this.userRepository.createUser(newUser)

           if(newUsers){
              await  this.otpRespository.otpStore(Otp)
           }
           

       return newUsers
       
       
     
    }
}