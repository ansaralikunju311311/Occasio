import { ManagerResponseDto } from '../../../../application/dtos/responses/manager-response.dto';
import { IAdminRepository } from '../../../../domain/repositories/admin/admin.repository.interface';
import { managerMapper } from '../../../../common/mappers/manager.mapper';
import { IManagerDetailsUseCase } from '../managerDetails/managerdetails.usecase.interface';

export class PendingmanagerDetailsUseCase implements IManagerDetailsUseCase {
  constructor(private _adminRepository: IAdminRepository) {}

  async execute(userId: string, search?: string): Promise<ManagerResponseDto | null> {
    const user = await this._adminRepository.findByuserId(userId, search);

    console.log(user);
    return user ? managerMapper.toResponse(user) : null;
  }
}
