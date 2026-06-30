import type { UserRole } from '../../common/enums/userrole-enum';
import type { UserStatus } from '../../common/enums/userstatus-enum';
// import { UserOtp } from "../../../../common/enums/user-otp.enum";
import type { UpgradeStatus } from '../../common/enums/upgrade-enums';
export class User {
  constructor(
    public readonly id: string | null,
    public name: string,
    public readonly email: string,
    public password: string,
    public role: UserRole,
    public status: UserStatus,
    public isVerified: boolean,
    public applyingupgrade: UpgradeStatus,
    public rejectedAt: Date | null,
    public reapplyAt: Date | null,
    public activeSubscription?: string | null,
    public eventsCreated: number = 0,
    public walletBalance: number = 0,
  ) {}
}
