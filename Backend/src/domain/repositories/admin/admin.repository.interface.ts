import type { User } from '../../entities/user.entity';
import type { EventManager } from '../../entities/manager.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

export interface IAdminRepository {
  findAllUser(
    params: PaginationParams,
  ): Promise<PaginatedResponse<User> | null>;
  findById(id: string): Promise<User | null>;
  findByuserId(userId: string, search?: string): Promise<EventManager | null>;
}
