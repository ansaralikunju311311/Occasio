/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import type { IUserDocument } from '../../database/model/user.model';
import { UserModel } from '../../database/model/user.model';
import { BaseRepository } from '../../../infrastructure/repositories/base.repository';
// import { OTP } from "domain/entities/otp.entity";
// import { IOtp } from "infrastructure/database/model/otp.model";
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
      //   otp: user.otp,
      //   otpExpires: user.otpExpires,
      //   otpType: user.otpType,
      //   otpSendAt: user.otpSendAt,
      applyingupgrade: user.applyingupgrade,
      rejectedAt: user.rejectedAt,
      reapplyAt: user.reapplyAt,
      walletBalance: user.walletBalance,
    });

    return this.toEntity(doc);
  }

  async updateUser(user: User, session?: any): Promise<User> {
    const doc = await super.updateOne(
      { email: user.email },
      {
        status: user.status,
        name: user.name,
        password: user.password,
        isVerified: user.isVerified,
        applyingupgrade: user.applyingupgrade,
        role: user.role,
        rejectedAt: user.rejectedAt,
        reapplyAt: user.reapplyAt,
        eventsCreated: user.eventsCreated,
        activeSubscription: user.activeSubscription,
        walletBalance: user.walletBalance,
      },
      { session },
    );

    if (!doc) {
      throw new Error('User not found');
    }

    return this.toEntity(doc);
  }

  private toEntity(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.role,
      doc.status,
      doc.isVerified,
      doc.applyingupgrade,
      doc.rejectedAt,
      doc.reapplyAt,
      doc.activeSubscription
        ? doc._id
          ? doc.activeSubscription._id?.toString() ||
            doc.activeSubscription.toString()
          : doc.activeSubscription
        : undefined,
      doc.eventsCreated || 0,
      doc.walletBalance || 0,
    );
  }
}
