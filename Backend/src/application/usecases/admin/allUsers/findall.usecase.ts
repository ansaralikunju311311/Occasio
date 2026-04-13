import { User } from '../../../../domain/entities/user.entity';
import { IAdminRepository } from '../../../../domain/repositories/admin/admin.repository.interface';
import { IFindallUseCase } from './findall.usecase.interface';
import { PaginationParams, PaginatedResponse } from '../../../../common/interfaces/pagination.interface';

export class FindAllUseCase implements IFindallUseCase {
  constructor(private adminRepository: IAdminRepository) {}
  async execute(params: PaginationParams): Promise<PaginatedResponse<User> | null> {
    const result = await this.adminRepository.findAllUser(params);

    return result;
  }
}
