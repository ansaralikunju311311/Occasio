import type { DashboardStatsResult } from '../../../../domain/repositories/admin/admin.repository.interface';

export interface IGetDashboardStatsUseCase {
  execute(): Promise<DashboardStatsResult>;
}
