import { UserOtp } from "../../../common/enums/userotp-enum";

import mongoose,{ Document,Schema } from "mongoose";

export interface IOtp extends Document{
   email:string,
   otp:string,
   otpType:UserOtp,
   otpExpires:Date,
   isUsed:boolean,
   otpSendAt:Date

}
const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpType: { type: String,  enum:Object.values(UserOtp) as UserOtp[], required: true },

    otpExpires: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },

    isUsed: {
      type: Boolean,
      default: false
     },

    otpSendAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
export const OtpModel = mongoose.model<IOtp>("OTP",otpSchema)