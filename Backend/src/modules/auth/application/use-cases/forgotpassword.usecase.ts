import { throwDeprecation } from "node:process";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { generateOTP } from "../../../../common/utils/generate-otp.js";
import { User } from "../../domain/entites/user.entity.js";
import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
export class ForgotpasswordUsecase {
    constructor(
        private userRepository :IUserRepository
    ){}



    async execute(email:string):Promise<User>{



        const data = await this.userRepository.findByEmail(email)


            if(!data){
                throw new Error('the register the first')
            }

            if(data.isVerfied  == false){
                throw new Error('the useer is verifeid first')
            }
            if(data.status == UserStatus.BLOCK){
                 throw new Error(' this is the bloced user')
            }


             let otpSendAt = new Date()
           let otp = generateOTP();
        
            const otpExpires = new Date(Date.now() + 1 * 60 * 1000)
            




            const newUser = new User(
                        data.id,
                        data.name,
                        data.email,
                        data.password,
                        data.role,
                        data.status,
                        data.isVerfied,
                        otp,
                        otpExpires,
                        UserOtp.FORGOT_PASSWORD,
                        otpSendAt
                        
                    );
            

        
                    return this.userRepository.update(newUser)
            
    }



}