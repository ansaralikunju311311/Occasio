
import { User } from "../../../../domain/entities/user.entity";
export interface IFindallUseCase {
  execute(): Promise<User[] | null>;
}