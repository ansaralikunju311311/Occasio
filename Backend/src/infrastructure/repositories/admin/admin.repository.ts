import { EventManager } from "../../../domain/entities/manager.entity";
import { User } from "../../../domain/entities/user.entity";
import { IAdminRepository } from "../../../domain/repositories/admin/admin.repository.interface";
import { EventManagerModel } from "../../database/model/manager.model";
import { UserModel } from "../../database/model/user.model";

export class AdminRepository implements IAdminRepository {



  

    async findAllUser(search?: string): Promise<User[] | null> {

  const query: any = {
    role: { $ne: "ADMIN" } // always exclude admin
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } }
    ];
  }

  const users = await UserModel.find(query);

  if (!users || users.length === 0) return null;

  return users.map((user) => (
    new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password,
      user.role,
      user.status,
      user.isVerified,
      user.applyingupgrade,
      user.rejectedAt,
      user.reapplyAt
    )
  ));
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
           
            user.applyingupgrade,
            user.rejectedAt,
            user.reapplyAt
        )

    }

    async findByuserId(id: string): Promise<EventManager | null> {

        console.log("id evide vannooo just", id)
        const manager = await EventManagerModel.findOne({ userId: id });





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