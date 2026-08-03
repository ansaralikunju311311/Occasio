import type { IAdminRepository, DashboardStatsResult } from '../../../../domain/repositories/admin/admin.repository.interface';
import type { IGetDashboardStatsUseCase } from './dashboardstats.usecase.interface';

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(private _adminRepository: IAdminRepository) {}

  async execute(): Promise<DashboardStatsResult> {
    return await this._adminRepository.getDashboardStats();
  }
}
