import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IGetEventsUseCase } from './getEvents.usecase.interface';
import {
  PaginationParams,
  PaginatedResponse,
} from '../../../../common/interfaces/pagination.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponseDto> | null> {
    const result = await this.eventRepository.findAllEvents(params);

    if (result && result.data) {
      return {
        ...result,
        data: eventMapper.toResponseArray(result.data),
      };
    }
    return result;
  }
}
