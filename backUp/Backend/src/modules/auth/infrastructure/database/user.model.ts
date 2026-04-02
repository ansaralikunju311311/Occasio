import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../../../../common/enums/user-role.enum.js";
import { UserStatus } from "../../../../common/enums/user-status.enum.js";
import { UserOtp } from "../../../../common/enums/user-otp.enum.js";
import { UpgradeStatus } from "../../../../common/enums/upgrade.enum.js";
// import { devNull } from "node:os";

export interface IUserDocument extends Document {
    name: string,
    email: string,
    password: string,
    role: UserRole,
    status: UserStatus,
    isVerified: boolean,
    otp: string | null,
    otpExpires: Date | null,
    otpType: UserOtp | null,
    otpSendAt: Date | null,

    applyingupgrade: UpgradeStatus,
    rejectedAt: Date | null,
    reapplyAt: Date | null
}

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,

        },

        role: {
            type: String,
            enum: Object.values(UserRole) as string[],
            default: UserRole.USER

        },
        status: {
            type: String,
            enum: Object.values(UserStatus) as string[],
            default: UserStatus.ACTIVE
        },
        isVerified: {
            type: Boolean,
            default: false

        },
        otp: {
            type: String
        },
        otpExpires: {
            type: Date
        },
        otpType: {
            type: String,
            enum: Object.values(UserOtp) as string[],
            default: null
        },
        otpSendAt: {
            type: Date
        },
        applyingupgrade: {
            type: String,
            enum: Object.values(UpgradeStatus),
            default: UpgradeStatus.NONE
        },
        rejectedAt: {
            type: Date,
            default: null
        },
        reapplyAt: {
            type: Date,
            default: null
        }


    },
    { timestamps: true }
)
export const UserModel = mongoose.model<IUserDocument>("User", userSchema);