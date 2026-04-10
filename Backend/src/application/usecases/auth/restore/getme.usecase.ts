import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { HttpStatus } from '../../../../common/constants/http-status';
import { AppError } from '../../../../common/errors/apperror';
import { User } from '@/domain/entities/user.entity';
import { IApprovalUseCase } from '../../admin/manageApproval/managerapproval.usecase.interface';
export class GetmeUseCase implements IApprovalUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string):Promise<User | null> {
    console.log('evidunn as chyne', id);
    const user = await this.userRepository.findByIdUser(id);
    console.log('get the correct user', user);

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
