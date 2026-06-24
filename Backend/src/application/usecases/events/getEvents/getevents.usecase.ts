import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

import type { IGetEventsUseCase } from './getEvents.usecase.interface';

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private _eventRepository: IEventRepository) {}
  async execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponseDto> | null> {
    const result = await this._eventRepository.findAllEvents(params);

    if (result && result.data) {
      return {
        ...result,
        data: eventMapper.toResponseArray(result.data),
      };
    }
    return null;
  }
}
