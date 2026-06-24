import { managerMapper } from '../../../../common/mappers/manager.mapper';
import { ManagerResponseDto } from '../../../../application/dtos/responses/manager-response.dto';
import { IEventManagerRepository } from '../../../../domain/repositories/manger.repository.interface';
import { IManagerDetailsUseCase } from './managerdetails.usecase.interface';
export class ManagerDetailsUseCase implements IManagerDetailsUseCase {
  constructor(private _managerRepository: IEventManagerRepository) {}

  async execute(id: string): Promise<ManagerResponseDto | null> {
    const manager = await this._managerRepository.findByIdManager(id);
    if (!manager) return null;
    return managerMapper.toResponse(manager);
  }
}
