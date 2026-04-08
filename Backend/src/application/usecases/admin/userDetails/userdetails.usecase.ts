import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { IApprovalUseCase } from '../manageApproval/managerapproval.usecase.interface.js';

export class UserDetailsUseCase implements IApprovalUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    const user = await this.userRepository.findByIdUser(userId);
    if (!user) return null;

    return user;
  }
}
