import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IMyEventsUseCase } from './myevents.usecase.interface';
import {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export class MyEventsUseCase implements IMyEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponseDto> | null> {
    const result = await this.eventRepository.findEvents(userId, params);

    if (result && result.data) {
      return {
        ...result,
        data: eventMapper.toResponseArray(result.data),
      };
    }
    return null;
  }
}
