import { User } from '../../entities/user.entity';
import { EventManager } from '../../entities/manager.entity';
export interface IAdminRepository {
  findAllUser(search?: string): Promise<User[] | null>;
  findById(id: string): Promise<User | null>;
  findByuserId(userId: string, search?: string): Promise<EventManager | null>;
}
