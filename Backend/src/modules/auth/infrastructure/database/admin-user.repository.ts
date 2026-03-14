import { User } from "../../domain/entites/user.entity.js";
import { IAdminRepository } from "../../domain/repositories/admin/admin.repository.interface.js";
import { UserModel } from "./user.model.js";

export class AdminRepository implements IAdminRepository{

    async findAllUser(): Promise<User[] | null> {
        const users = await UserModel.find({role:{$ne:"ADMIN"}});
       if(!users) return null;
       
        return users.map((user)=>(
            new User(
                   user._id.toString(),
            user.name,
            user.email,
            user.password,
            user.role,
            user.status,
            user.isVerified,
            user.otp,
            user.otpExpires,
            user.otpType,
            user.otpSentAt,
            user.isEventManger,
            user.applyingupgrade
            )
        ))
    }
}