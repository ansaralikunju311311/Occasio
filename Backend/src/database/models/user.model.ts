import mongoose, { Schema, Document } from "mongoose";
import type { IUser } from "../../common/types/user.type";
import { UserRole } from "../../common/enums/user-role.enum";
import { UserStatus } from "../../common/enums/user-status.enum";

export interface IuserDocument extends IUser, Document {}

const userSchema = new Schema<IuserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isBlocked: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IuserDocument>("User", userSchema);
