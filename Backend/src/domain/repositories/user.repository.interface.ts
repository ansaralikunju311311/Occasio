/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '../../domain/entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User, session?: any): Promise<User>;
  findByIdUser(id: string): Promise<User | null>;
}
