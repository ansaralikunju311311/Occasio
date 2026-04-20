import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';
import { IEventDetailsUseCase } from './eventdetails.usecase.interface';

export class EventDetailsUseCase implements IEventDetailsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<EventResponseDto | null> {
    const events = await this.eventRepository.findByIdEvents(id);
    console.log('events in execute:', events);
    return events ? eventMapper.toResponse(events) : null;
  }
}
