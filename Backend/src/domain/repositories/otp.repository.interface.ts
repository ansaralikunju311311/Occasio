    // otpStore(otp:OTP):Promise<void>
import { OTP } from "domain/entities/otp.entity"
    export interface IOtpRepository{
            otpStore(otp:OTP):Promise<OTP | null>

    }