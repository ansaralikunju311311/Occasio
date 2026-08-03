import type { IDbSession } from '../services/transaction-manager.interface';
import type { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User, session?: IDbSession): Promise<User>;
  findByIdUser(id: string): Promise<User | null>;
}
