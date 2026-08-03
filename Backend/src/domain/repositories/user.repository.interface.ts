import type mongoose from 'mongoose';
import type { User } from '../../domain/entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User, session?: mongoose.ClientSession): Promise<User>;
  findByIdUser(id: string): Promise<User | null>;
}
