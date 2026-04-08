import {
  IOtp,
  OtpModel,
} from '../../../infrastructure/database/model/otp.model';
import { BaseRepository } from '../base.repository';
import type { IOtpRepository } from '../../../domain/repositories/otp.repository.interface';
import { OTP } from '../../../domain/entities/otp.entity';
// import { User } from "domain/entities/user.entity";
export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
  constructor() {
    super(OtpModel);
  }

  async otpStore(otp: OTP): Promise<OTP | null> {
    const data = await super.findOne({ email: otp.email });

    if (data) {
      const updatedDoc = await super.updateOne(
        { email: otp.email },
        {
          otp: otp.otp,
          otpExpires: otp.otpExpires,
          otpSendAt: otp.otpSendAt,
          otpType: otp.otpType,
          isUsed: otp.isUsed,
        },
      );
      return updatedDoc ? this.toEntity(updatedDoc) : null;
    }

    const doc = await super.create({
      email: otp.email,
      otp: otp.otp,
      isUsed: otp.isUsed,
      otpExpires: otp.otpExpires,
      otpSendAt: otp.otpSendAt,
      otpType: otp.otpType,
    });
    console.log('check here the value id comming', doc);

    return this.toEntity(doc);
  }

  async MatchOTP(data: { email: string; otp: string }): Promise<OTP | null> {
    const Userdata = await super.findOne({ email: data.email });
    if (!Userdata) return null;
    return this.toEntity(Userdata);
  }

  async ResendOtp(data: { email: string }): Promise<OTP | null> {
    const otpDetails = await super.findOne({ email: data.email });

    return otpDetails ? this.toEntity(otpDetails) : null;
  }

  private toEntity(doc: any): OTP {
    return new OTP(
      doc._id.toString(),
      doc.email,
      doc.otp,
      doc.otpExpires,
      doc.otpType,
      doc.isUsed,
      doc.otpSendAt,
    );
  }
}
