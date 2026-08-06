import type mongoose from 'mongoose';

import type { IDbSession } from '../../../domain/services/transaction-manager.interface';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { User } from '../../../domain/entities/user.entity';
import type { IUserDocument } from '../../database/model/user.model';
import { UserModel } from '../../database/model/user.model';
import { BaseRepository } from '../../../infrastructure/repositories/base.repository';
import { userMapper } from '../../../common/mappers/user.mapper';

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.findOne({ email });
    return doc
      ? userMapper.toDomain(doc as unknown as Record<string, unknown>)
      : null;
  }

  async findByIdUser(id: string): Promise<User | null> {
    const doc = await super.findById(id);
    return doc
      ? userMapper.toDomain(doc as unknown as Record<string, unknown>)
      : null;
  }

  async createUser(user: User): Promise<User> {
    const doc = await super.create(
      userMapper.toPersistence(user) as Partial<IUserDocument>,
    );

    return userMapper.toDomain(doc as unknown as Record<string, unknown>);
  }

  async updateUser(user: User, session?: IDbSession): Promise<User> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    const persistenceData = userMapper.toPersistence(user);
    if (persistenceData.activeSubscription) {
      persistenceData.activeSubscription =
        persistenceData.activeSubscription as unknown as mongoose.Schema.Types.ObjectId;
    }

    const doc = await super.updateOne(
      { email: user.email },
      persistenceData as Partial<IUserDocument>,
      { session: mongoSession },
    );

    if (!doc) {
      throw new Error('User not found');
    }

    return userMapper.toDomain(doc as unknown as Record<string, unknown>);
  }
}
