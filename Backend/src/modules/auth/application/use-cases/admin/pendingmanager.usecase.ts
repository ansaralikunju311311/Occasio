import { EventManager } from "../../../domain/entites/manager.entity.js";
import { IAdminRepository } from "../../../domain/repositories/admin/admin.repository.interface.js";
// import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
// import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";
// import { IUserDocument } from "../../../infrastructure/database/user.model.js";

export class PendingmanagerDetailsUseCase {
  constructor(
    private adminRepository: IAdminRepository
  ) { }

  async execute(userId:string): Promise<EventManager | null> {

    const user = await this.adminRepository.findByuserId(userId);


    console.log(user)
    if (!user) return null;

    return user
  }




}