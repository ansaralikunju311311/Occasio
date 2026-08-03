import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import { AppError } from '../../../common/errors/apperror';
import { HttpStatus } from '../../../common/constants/http-status';
import { socketService } from '../../../infrastructure/services/socket.service';
import { eventMapper } from '../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../dtos/responses/event-response.dto';

export class EndLiveUseCase {
  constructor(private _eventRepository: IEventRepository) {}

  async execute(eventId: string, managerId: string): Promise<EventResponseDto> {
    const event = await this._eventRepository.findByIdEvents(eventId);

    if (!event) {
      throw new AppError('Event not found', HttpStatus.NOT_FOUND);
    }

    if (event.createdBy.toString() !== managerId) {
      throw new AppError('You are not authorized to end live for this event', HttpStatus.FORBIDDEN);
    }

    const updatedEvent = await this._eventRepository.updateEvent(eventId, {
      status: EventStatus.COMPLETED,
    });

    if (!updatedEvent) {
      throw new AppError('Failed to update event status to COMPLETED', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Broadcast stream ended to live room
    try {
      const io = socketService.getIO();
      if (io) {
        io.to(`live_event_${eventId}`).emit('event_ended', {
          eventId,
          message: 'The live stream has ended.',
        });
      }
    } catch (err) {
      console.error('[EndLiveUseCase] Socket broadcast error:', err);
    }

    return eventMapper.toResponse(updatedEvent);
  }
}
