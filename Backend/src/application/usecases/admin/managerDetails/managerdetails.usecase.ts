import { managerMapper } from '../../../../common/mappers/manager.mapper';
import type { ManagerResponseDto } from '../../../../application/dtos/responses/manager-response.dto';
import type { IEventManagerRepository } from '../../../../domain/repositories/manger.repository.interface';

import type { IManagerDetailsUseCase } from './managerdetails.usecase.interface';
export class ManagerDetailsUseCase implements IManagerDetailsUseCase {
  constructor(private _managerRepository: IEventManagerRepository) {}

  async execute(id: string): Promise<ManagerResponseDto | null> {
    const manager = await this._managerRepository.findByIdManager(id);
    if (!manager) {
      return null;
    }
    return managerMapper.toResponse(manager);
  }
}
