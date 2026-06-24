import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export interface IGetEventsUseCase {
  execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponseDto> | null>;
}
