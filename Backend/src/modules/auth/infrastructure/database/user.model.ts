import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
// import { devNull } from "node:os";

export interface IUserDocument extends Document{
    name:string,
    email:string,
    password:string,
    role:UserRole,
    status:UserStatus,
    isVerfiled: boolean,
    otp:string,
    otpExpires:Date,
    otpType: UserOtp
}

const userSchema = new Schema<IUserDocument>(
       {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },

    role:{
        type:String,
        enum:Object.values(UserRole) as string[],
        default:UserRole.USER

    },

    status:{
        type:String,
        enum:Object.values(UserStatus) as string[],
        default :UserStatus.ACTIVE
    },
    isVerfiled:{
        type:Boolean,
        default :false

    },
    otp:{
        type:String
    },
    otpExpires:{
        type:Date
    },
    otpType:{
        type:String,
        enum:Object.values(UserOtp) as string[],
        default : null
    }
},
{timestamps:true}
)
export const UserModel = mongoose.model<IUserDocument>("User", userSchema);