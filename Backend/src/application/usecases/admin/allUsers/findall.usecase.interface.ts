import { User } from '../../../../domain/entities/user.entity';
import { PaginationParams, PaginatedResponse } from '../../../../common/interfaces/pagination.interface';

export interface IFindallUseCase {
  execute(params: PaginationParams): Promise<PaginatedResponse<User> | null>;
}
