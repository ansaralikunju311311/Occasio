
import { UserRole } from "../../../../common/enums/user-role.enum.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { UpgradeStatus } from "../../../../common/enums/upgrade.enum.js";
export class User {
  constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly email: string,
    public password: string,
    public role: UserRole,
    public status: UserStatus,
    public isVerified: boolean,
    public otp: string | null,
    public otpExpires: Date | null,
    public otpType: UserOtp | null,
    public otpSendAt: Date | null,
    public applyingupgrade: UpgradeStatus,
    public rejectedAt : Date | null

  ) { }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}