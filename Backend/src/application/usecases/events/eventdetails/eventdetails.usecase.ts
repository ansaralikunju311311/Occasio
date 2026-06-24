import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';
import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';

import type { IEventDetailsUseCase } from './eventdetails.usecase.interface';

export class EventDetailsUseCase implements IEventDetailsUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
  ) {}

  async execute(id: string): Promise<EventResponseDto | null> {
    const events = await this._eventRepository.findByIdEvents(id);
    if (!events) {
      return null;
    }

    if (events.eventType === 'ONLINE' || events.eventType === 'HYBRID') {
      const count = await this._bookingRepository.getOnlineBookedCount(id);
      events.bookedTickets = count;
    }

    return eventMapper.toResponse(events);
  }
}
