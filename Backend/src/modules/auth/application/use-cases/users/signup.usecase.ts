import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { IHashServive } from "../../../domain/services/hash.service.interface.js";
import { signupDTO } from "../../dtos/signup.dto.js";
import { User } from "../../../domain/entites/user.entity.js";
import { UserRole } from "../../../../../common/enums/user-role.enum.js";
import { UserStatus } from "../../../../../common/enums/user-status.enum.js";
import { UserOtp } from "../../../../../common/enums/user-otp.enum.js";
import { generateOTP } from "../../../../../common/utils/generate-otp.js";
import { AppError } from "../../../../../common/errors/app-error.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { EmailSerive } from "../../../../../common/service/email.service.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";
export class SignupUsecase{
    constructor(
        private userRepository:IUserRepository,
        private hashService :IHashServive,
        private emailService:EmailSerive
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
        const applyingupgrade=false
        const isEventManger = false;
        const isVerified = false ;
        const  rejected = null

        const otpSendAt = new Date()
        const otp = generateOTP();
        
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
     

        const checkig = await this.emailService.sendOtpEmail(data.email,otp);
        console.log("reched here",checkig)
    
        const newUser = new User(
            null,
            data.name,
            data.email,
            hashpassword,
            role,
            UserStatus.ACTIVE,
            isVerified,
            otp,
            otpExpires,
            UserOtp.SIGNUP,
            otpSendAt,
            
            applyingupgrade,
            rejected

            
        );

       
        return this.userRepository.create(newUser)
     
    }
}