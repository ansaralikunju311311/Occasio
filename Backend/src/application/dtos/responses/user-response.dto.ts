import { UserRole } from '../../../common/enums/userrole-enum';
import { UserStatus } from '../../../common/enums/userstatus-enum';
import { UpgradeStatus } from '../../../common/enums/upgrade-enums';

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
  createdAt?: Date;
  updatedAt?: Date;
}
