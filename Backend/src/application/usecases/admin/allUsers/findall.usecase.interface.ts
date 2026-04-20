import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';

export interface IFindallUseCase {
  execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<UserResponseDto> | null>;
}
