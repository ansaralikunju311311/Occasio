import type { UpdatePasswordDto } from '../../../dtos/updatepassword.dto';
import { HttpStatus } from '../../../../common/constants/http-status';
import { ErrorMessage } from '../../../../common/enums/message-enum';
import { AppError } from '../../../../common/errors/apperror';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IHashServive } from '../../../../domain/services/hash.service.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserStatus } from '../../../../common/enums/userstatus-enum';
import { User } from '../../../../domain/entities/user.entity';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';

import type { IUpdateUseCase } from './update.usecase.interface';
export class UpdatePasswordUseCase implements IUpdateUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _compareService: IHashServive,
    private _hashService: IHashServive,
  ) {}

  async execute(data: UpdatePasswordDto): Promise<UserResponseDto> {
    const user = await this._userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isMatch = await this._compareService.comapre(
      data.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new AppError(
        ErrorMessage.INCORRECT_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.status === UserStatus.BLOCK) {
      throw new AppError(ErrorMessage.ACCOUNT_BLOCKED, HttpStatus.UNAUTHORIZED);
    }
    const hashpassword = await this._hashService.hash(data.newPassword);

    const newUser = new User(
      user.id,
      user.name,
      user.email,
      hashpassword,
      user.role,
      user.status,
      user.isVerified,

      user.applyingupgrade,
      user.rejectedAt,
      user.reapplyAt,
    );

    const updatedUser = await this._userRepository.updateUser(newUser);
    return userMapper.toResponse(updatedUser);
  }
}
