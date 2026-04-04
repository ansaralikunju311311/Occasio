    // otpStore(otp:OTP):Promise<void>
import { VerfiyOtpDto } from "application/dtos/verifyotp.dto"
import { OTP } from "domain/entities/otp.entity"
import { User } from "domain/entities/user.entity"

    export interface IOtpRepository{
            otpStore(otp:OTP):Promise<OTP | null>
            MatchOTP(data:{email:string,otp:string}):Promise<OTP|null>
            ResendOtp(data:{email:string}):Promise<OTP | null>

    }