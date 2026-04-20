import { EventManager } from '../../../../domain/entities/manager.entity';
import { IAdminRepository } from '../../../../domain/repositories/admin/admin.repository.interface';
import { IManagerDetailsUseCase } from '../managerDetails/managerdetails.usecase.interface';
// import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface";
// import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface";
// import { IUserDocument } from "../../../infrastructure/database/user.model";

export class PendingmanagerDetailsUseCase implements IManagerDetailsUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(userId: string, search?: string): Promise<EventManager | null> {
    const user = await this.adminRepository.findByuserId(userId, search);

    console.log(user);
    if (!user) return null;

    return user;
  }
}
