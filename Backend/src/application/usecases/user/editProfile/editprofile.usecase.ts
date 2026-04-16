import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { EditProfileDto } from '../../../../application/dtos/editprofile.dto';
import { IEditProfileUseCase } from './editprofile.usecase.interface';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { userMapper } from '../../../../common/mappers/user.mapper';

export class EditProfileUseCase implements IEditProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(datas: EditProfileDto): Promise<UserResponseDto | null> {
    const data = await this.userRepository.findByIdUser(datas.userId);

    if (!data) return null;

    const newUser = new User(
      null,
      datas.name, // Fixed bug where assignment happened in constructor
      data.email,
      data.password,
      data.role,
      data.status,
      data.isVerified,
      data.applyingupgrade,
      data.rejectedAt,
      data.reapplyAt,
    );
    const updatedUser = await this.userRepository.updateUser(newUser);
    return userMapper.toResponse(updatedUser);
  }
}
