import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

import type { IMyEventsUseCase } from './myevents.usecase.interface';

export class MyEventsUseCase implements IMyEventsUseCase {
  constructor(private _eventRepository: IEventRepository) {}

  async execute(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponseDto> | null> {
    const result = await this._eventRepository.findEvents(userId, params);

    if (result && result.data) {
      return {
        ...result,
        data: eventMapper.toResponseArray(result.data),
      };
    }
    return null;
  }
}
