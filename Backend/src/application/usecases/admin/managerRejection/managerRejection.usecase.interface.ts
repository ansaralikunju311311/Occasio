import { User } from '@/domain/entities/user.entity';
export interface IManagerRejectionUseCase {
  execute(id: string, search?: string): Promise<User | null>;
}
