
import { User } from "../../../../domain/entities/user.entity";
import { EditProfileDto } from "../../../../application/dtos/editprofile.dto";
export interface IEditProfileUseCase {
  execute(data:EditProfileDto ): Promise<User | null>;
}