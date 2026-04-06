
import { User } from "../../../../domain/entities/user.entity";
export interface IReapplyUseCase {
  execute(data:string ): Promise<User | null>;
}