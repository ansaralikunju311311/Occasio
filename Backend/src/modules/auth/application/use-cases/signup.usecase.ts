import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";

import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { signupDTO } from "../dtos/signup.dto.js";
import { User } from "../../domain/entites/user.entity.js";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { generateOTP } from "../../../../common/utils/generate-otp.js";
export class SignupUsecase{
    constructor(
        private userRepository:IUserRepository,
        private hashService :IHashServive
    ){}


    async execute(data:signupDTO):Promise<User>{
        console.log("Incoming signup data:", data);
        const existingUser = await this.userRepository.findByEmail(data.email);
        if(existingUser){
            throw new Error('user already exists')
        }
        
        if(data.confirmpassword != data.password){
            throw new Error('password is not matching')
        }


        const hashpassword = await this.hashService.hash(data.password)
        let role: UserRole = UserRole.USER;
        let isVerified = false ;
        let otpSendAt = new Date()
        let otp = generateOTP();
        
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000)
         if (data.role && data.role === "EVENT_MANAGER") {
    role = UserRole.EVENT_MANAGER;
  }
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
            otpSendAt
            
        );

        // console.log("newUser",newUser)
        return this.userRepository.create(newUser)
        // console.log("sdfghj",value)
        // return value
    }
}