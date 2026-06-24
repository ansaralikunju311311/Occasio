import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { HttpStatus } from '../../../../common/constants/http-status';
import { AppError } from '../../../../common/errors/apperror';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { IApprovalUseCase } from '../../admin/manageApproval/managerapproval.usecase.interface';
export class GetmeUseCase implements IApprovalUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDto | null> {
    console.log('evidunn as chyne', id);
    const user = await this._userRepository.findByIdUser(id);
    console.log('get the correct user', user);

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return userMapper.toResponse(user);
  }
}
