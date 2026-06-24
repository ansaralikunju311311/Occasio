import type { UserStatus } from '../../common/enums/userstatus-enum';

export interface ManageDto {
  userId: string;
  status: UserStatus;
}
