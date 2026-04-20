import {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';
import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export interface IGetEventsUseCase {
  execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponseDto> | null>;
}
