import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import type { UpgraderoleDto } from '../../../../application/dtos/upgraderole.dto';
export interface IUpgradeUseCase {
  execute(data: UpgraderoleDto): Promise<UserResponseDto | null>;
}
