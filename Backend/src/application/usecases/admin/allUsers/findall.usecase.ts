import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { IAdminRepository } from '../../../../domain/repositories/admin/admin.repository.interface';
import { IFindallUseCase } from './findall.usecase.interface';
import {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';

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
