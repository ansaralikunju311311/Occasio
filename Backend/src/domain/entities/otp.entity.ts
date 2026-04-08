//   email:string,
//    otp:string,
//    otpType:UserOtp,
//    otpExpires:Date,
//    isUsed:boolean,
//    otpSendAt:Date
import { UserOtp } from '../../common/enums/userotp-enum';

export class OTP {
  constructor(
    public readonly id: string | null,

    public email: string,
    public otp: string,
    public otpExpires: Date,
    public otpType: UserOtp,
    public isUsed: boolean,
    public otpSendAt: Date,
  ) {}
}
