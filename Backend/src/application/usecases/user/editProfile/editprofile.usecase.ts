import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { EditProfileDto } from '../../../../application/dtos/editprofile.dto';
import { IEditProfileUseCase } from './editprofile.usecase.interface';
export class EditProfileUseCase implements IEditProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(datas: EditProfileDto): Promise<User | null> {
    const data = await this.userRepository.findByIdUser(datas.userId);

    if (!data) return null;

    const newUser = new User(
      null,
      (data.name = datas.name),
      data.email,
      data.password,
      data.role,
      data.status,
      data.isVerified,
      data.applyingupgrade,
      data.rejectedAt,
      data.reapplyAt,
    );
    return await this.userRepository.updateUser(newUser);
  }
}
