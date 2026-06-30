import type { UserRole } from '../../../common/enums/userrole-enum';
import type { UserStatus } from '../../../common/enums/userstatus-enum';
import type { UpgradeStatus } from '../../../common/enums/upgrade-enums';

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  applyingupgrade: UpgradeStatus;
  rejectedAt: Date | null;
  reapplyAt: Date | null;
  activeSubscription?: string | null;
  eventsCreated?: number;
  walletBalance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
