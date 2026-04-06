
import { User } from "../../../../domain/entities/user.entity";
export interface IApprovalUseCase {
  execute(id:string): Promise<User | null>;
}