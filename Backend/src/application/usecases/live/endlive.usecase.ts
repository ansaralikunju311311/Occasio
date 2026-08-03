import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import { AppError } from '../../../common/errors/apperror';
import { HttpStatus } from '../../../common/constants/http-status';
import type { INotificationService } from '../../../domain/services/notification-service.interface';
import { eventMapper } from '../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../dtos/responses/event-response.dto';
import { logger } from '../../../common/logger/logger';

export class EndLiveUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _notificationService: INotificationService,
  ) {}

  async execute(eventId: string, managerId: string): Promise<EventResponseDto> {
    const event = await this._eventRepository.findByIdEvents(eventId);

    if (!event) {
      throw new AppError('Event not found', HttpStatus.NOT_FOUND);
    }

    const creatorId =
      typeof event.createdBy === 'string'
        ? event.createdBy
        : (event.createdBy as { id?: string; _id?: string }).id ||
          (event.createdBy as { _id?: string })._id?.toString() ||
          String(event.createdBy);

    if (creatorId !== managerId) {
      throw new AppError(
        'Unauthorized: Only the event creator can end this stream',
        HttpStatus.FORBIDDEN,
      );
    }

    if (event.status !== EventStatus.LIVE) {
      throw new AppError('Event is not currently live', HttpStatus.BAD_REQUEST);
    }

    const updatedEvent = await this._eventRepository.updateEvent(eventId, {
      status: EventStatus.COMPLETED,
    });

    if (!updatedEvent) {
      throw new AppError(
        'Failed to update event status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Broadcast stream ended to live room
    try {
      this._notificationService.toRoomEmit(`live_event_${eventId}`, 'event_ended', {
        eventId,
        message: 'The live stream has ended.',
      });
    } catch (err) {
      logger.error(`[EndLiveUseCase] Socket broadcast error: ${String(err)}`);
    }

    return eventMapper.toResponse(updatedEvent);
  }
}
