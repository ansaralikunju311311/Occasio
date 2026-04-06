import { User } from "../../../../domain/entities/user.entity";
import { ManageDto } from "../../../../application/dtos/manager.dto";
export interface IUserManageUseCase {
  execute(data:ManageDto): Promise<User | null>;
}