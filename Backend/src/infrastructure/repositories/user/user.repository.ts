import type mongoose from 'mongoose';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import type { IUserDocument } from '../../database/model/user.model';
import { UserModel } from '../../database/model/user.model';
import { BaseRepository } from '../../../infrastructure/repositories/base.repository';

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.findOne({ email });
    return doc ? this.toEntity(doc) : null;
  }

  async findByIdUser(id: string): Promise<User | null> {
    const doc = await super.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async createUser(user: User): Promise<User> {
    const doc = await super.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      applyingupgrade: user.applyingupgrade,
      rejectedAt: user.rejectedAt || undefined,
      reapplyAt: user.reapplyAt || undefined,
      walletBalance: user.walletBalance,
    });

    return this.toEntity(doc);
  }

  async updateUser(user: User, session?: mongoose.ClientSession): Promise<User> {
    const doc = await super.updateOne(
      { email: user.email },
      {
        status: user.status,
        name: user.name,
        password: user.password,
        isVerified: user.isVerified,
        applyingupgrade: user.applyingupgrade,
        role: user.role,
        rejectedAt: user.rejectedAt || undefined,
        reapplyAt: user.reapplyAt || undefined,
        eventsCreated: user.eventsCreated,
        activeSubscription: user.activeSubscription as unknown as mongoose.Schema.Types.ObjectId,
        walletBalance: user.walletBalance,
      },
      { session },
    );

    if (!doc) {
      throw new Error('User not found');
    }

    return this.toEntity(doc);
  }

  private toEntity(doc: IUserDocument | mongoose.HydratedDocument<IUserDocument> | Record<string, unknown>): User {
    const d = doc as Record<string, unknown>;
    let activeSubStr: string | undefined = undefined;
    if (d.activeSubscription) {
      const sub = d.activeSubscription as Record<string, unknown>;
      activeSubStr = (sub._id as mongoose.Types.ObjectId)?.toString() || sub.toString();
    }

    return new User(
      (d._id as mongoose.Types.ObjectId)?.toString() || (d.id as string) || '',
      d.name as string,
      d.email as string,
      d.password as string,
      d.role as User['role'],
      d.status as User['status'],
      Boolean(d.isVerified),
      d.applyingupgrade as User['applyingupgrade'],
      d.rejectedAt ? (d.rejectedAt as Date) : null,
      d.reapplyAt ? (d.reapplyAt as Date) : null,
      activeSubStr,
      Number(d.eventsCreated || 0),
      Number(d.walletBalance || 0),
    );
  }
}
