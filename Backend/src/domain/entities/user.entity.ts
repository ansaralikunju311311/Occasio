
import { UserRole } from "../../common/enums/userrole-enum";
import { UserStatus } from "../../common/enums/userstatus-enum";
// import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { UpgradeStatus } from "../../common/enums/upgrade-enums"
export class User {
  constructor(
    public readonly id: string | null,
    public  name: string,
    public readonly email: string,
    public password: string,
    public role: UserRole,
    public status: UserStatus,
    public isVerified: boolean,
    // public otp: string | null,
    // public otpExpires: Date | null,
    // public otpType: UserOtp | null,
    // public otpSendAt: Date | null,
    public applyingupgrade: UpgradeStatus,
    public rejectedAt: Date | null,
    public reapplyAt: Date | null

  ) { }

  
}

