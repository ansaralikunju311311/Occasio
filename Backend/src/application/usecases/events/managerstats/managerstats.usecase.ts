import type { IEventRepository, ManagerStatsResult } from '../../../../domain/repositories/event/event.repository.interface';
import type { IGetManagerStatsUseCase } from './managerstats.usecase.interface';

export class GetManagerStatsUseCase implements IGetManagerStatsUseCase {
  constructor(private _eventRepository: IEventRepository) {}

  async execute(managerId: string): Promise<ManagerStatsResult> {
    return await this._eventRepository.getManagerStats(managerId);
  }
}
