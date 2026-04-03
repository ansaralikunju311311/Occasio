import { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { User } from "../../../domain/entities/user.entity";
import { UserModel, IUserDocument } from "../../database/model/user.model";
import { BaseRepository } from "../../../infrastructure/repositories/base.repository";
// import { OTP } from "domain/entities/otp.entity";
// import { IOtp } from "infrastructure/database/model/otp.model";
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
  // async otpStore(otp: OTP): Promise<void> {
  //     const doc = await super.findOne(otp.email)
  //     if(doc){
  //       const otp = await super.create({
  //         email:doc.email,
  //         otp:doc.otp,

  //       })
  //     }
  // }

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