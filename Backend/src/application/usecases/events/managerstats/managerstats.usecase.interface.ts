import type { ManagerStatsResult } from '../../../../domain/repositories/event/event.repository.interface';

export interface IGetManagerStatsUseCase {
  execute(managerId: string): Promise<ManagerStatsResult>;
}
