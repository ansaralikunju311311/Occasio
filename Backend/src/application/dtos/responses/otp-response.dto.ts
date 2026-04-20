import { UserOtp } from '../../../common/enums/userotp-enum';

export interface OtpResponseDto {
  email: string;
  otpExpires: Date;
  otpType: UserOtp;
  isUsed: boolean;
  otpSendAt: Date;
}
