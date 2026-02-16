import {Types}  from "mongoose";
import { UserRole } from "../enums/user-role.enum";
import { UserStatus } from "../enums/user-status.enum";
export interface IUser {
 _id :Types.ObjectId
  name: string;
  email: string;
  password: string;
  role : UserRole,
//   isVerified?:boolean,
  isBlocked : UserStatus,
  

}
