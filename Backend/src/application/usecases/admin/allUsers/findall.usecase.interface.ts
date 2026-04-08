import { User } from '../../../../domain/entities/user.entity';
export interface IFindallUseCase {
  execute(search: string): Promise<User[] | null>;
}
