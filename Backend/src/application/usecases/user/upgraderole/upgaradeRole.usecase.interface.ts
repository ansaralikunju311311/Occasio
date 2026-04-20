import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { UpgraderoleDto } from '../../../../application/dtos/upgraderole.dto';
export interface IUpgradeUseCase {
  execute(data: UpgraderoleDto): Promise<UserResponseDto | null>;
}
