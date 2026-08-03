import type { User } from '../../entities/user.entity';
import type { EventManager } from '../../entities/manager.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

export interface DashboardStatsResult {
  totalUsers: number;
  eventManagers: number;
  activeEvents: number;
  commissionRevenue: number;
  subscriptionRevenue: number;
  publishingRevenue: number;
  totalRevenue: number;
  trend: Array<{
    year: number;
    month: number;
    label: string;
    subscription: number;
    publishing: number;
    commission: number;
    total: number;
    users: number;
    managers: number;
  }>;
}

export interface IAdminRepository {
  findAllUser(
    params: PaginationParams,
  ): Promise<PaginatedResponse<User> | null>;
  findById(id: string): Promise<User | null>;
  findByuserId(userId: string, search?: string): Promise<EventManager | null>;
  getDashboardStats(): Promise<DashboardStatsResult>;
}
