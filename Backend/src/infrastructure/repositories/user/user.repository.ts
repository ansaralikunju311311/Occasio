import { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { User } from "../../../domain/entities/user.entity";
import { UserModel, IUserDocument } from "../../database/model/user.model";
import { BaseRepository } from "../../../infrastructure/repositories/base.repository";
export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository {

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
      reapplyAt: user.reapplyAt
    } );

    return this.toEntity(doc);
  }

  async updateUser(user: User): Promise<User> {
    const doc = await super.updateOne( 
      { email: user.email },
      {
        // email:user.email,
        status: user.status,
        name:user.name,
        password: user.password,
        isVerified: user.isVerified,
        // otp: user.otp,
        // otpExpires: user.otpExpires,
        // otpType: user.otpType,
        // otpSendAt: user.otpSendAt,
        applyingupgrade: user.applyingupgrade,
        role: user.role,
        rejectedAt: user.rejectedAt,
        reapplyAt: user.reapplyAt
      }
    );

    if (!doc) throw new Error("User not found");

    return this.toEntity(doc); 
  }

  private toEntity(doc:any): User {
    return new User(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.role,
      doc.status,
      doc.isVerified,
    //   doc.otp,
    //   doc.otpExpires,
    //   doc.otpType,
    //   doc.otpSendAt,
      doc.applyingupgrade,
      doc.rejectedAt,
      doc.reapplyAt
    );
  }
}