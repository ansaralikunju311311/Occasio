import { userMapper } from '../../../../common/mappers/user.mapper';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import type { IAdminRepository } from '../../../../domain/repositories/admin/admin.repository.interface';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';

import type { IFindallUseCase } from './findall.usecase.interface';

export class FindAllUseCase implements IFindallUseCase {
  constructor(private _adminRepository: IAdminRepository) {}
  async execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<UserResponseDto> | null> {
    const result = await this._adminRepository.findAllUser(params);

    if (result && result.data) {
      return {
        ...result,
        data: userMapper.toResponseArray(result.data),
      };
    }

    return null;
  }
}
