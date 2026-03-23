import { EventManager } from "../../domain/entites/manager.entity.js";
import { User } from "../../domain/entites/user.entity.js";
import { IAdminRepository } from "../../domain/repositories/admin/admin.repository.interface.js";
import { EventManagerModel } from "./event_manager.model.js";
import { UserModel } from "./user.model.js";

export class AdminRepository implements IAdminRepository {

    async findAllUser(): Promise<User[] | null> {
        const users = await UserModel.find({ role: { $ne: "ADMIN" } });
        if (!users) return null;

        return users.map((user) => (
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

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id)
        if (!user) return null;
        return new User(
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

    }

    async findByuserId(id:string): Promise<EventManager | null> {

        console.log("id evide vannooo just",id)
        const manager = await EventManagerModel.findOne({userId:id});




        
        if (!manager) return null;

        return new EventManager(
            manager._id.toString(),
            manager.userId.toString(),
            manager.aboutEvents,
            manager.experienceLevel,
            manager.fullName,
            manager.organizationName,
            manager.certificate,
            manager.documentReference,
            manager.socialLinks,
            manager.organizationType
        )
    }

}