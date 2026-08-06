import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import { EventStatus } from '../../../../common/enums/eventstatus-enum';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import type { INotificationService } from '../../../../domain/services/notification-service.interface';
import { logger } from '../../../../common/logger/logger';

import type { IStartEventUseCase } from './startevent.usecase.interface';

export class StartEventUseCase implements IStartEventUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
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
        'Unauthorized: Only the event creator can start this event',
        HttpStatus.FORBIDDEN,
      );
    }

    if (event.status === EventStatus.LIVE) {
      throw new AppError('Event is already live', HttpStatus.BAD_REQUEST);
    }

    if (event.status === EventStatus.COMPLETED) {
      throw new AppError(
        'Completed events cannot be started',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (event.status === EventStatus.CANCELED) {
      throw new AppError(
        'Canceled events cannot be started',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedEvent = await this._eventRepository.updateEvent(eventId, {
      status: EventStatus.LIVE,
    });

    if (!updatedEvent) {
      throw new AppError(
        'Failed to start event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Emit live notifications to booked users
    try {
      const bookings =
        await this._bookingRepository.findConfirmedBookingsByEventId(eventId);

      const bookedUserIds = Array.from(
        new Set(
          bookings
            .map((b) => {
              if (!b.userId) {
                return null;
              }
              if (typeof b.userId === 'string') {
                return b.userId;
              }
              const uObj = b.userId as { id?: string; _id?: string };
              return uObj.id || uObj._id?.toString() || String(b.userId);
            })
            .filter(Boolean) as string[],
        ),
      );

      logger.info(
        `[StartEventUseCase] Found ${bookings.length} confirmed bookings for event ${eventId}. Notifying user IDs: ${JSON.stringify(bookedUserIds)}`,
      );

      const notificationPayload = {
        type: 'EVENT_LIVE',
        eventId: updatedEvent.id,
        eventTitle: updatedEvent.title,
        message: `🔴 Event "${updatedEvent.title}" is now LIVE!`,
        timestamp: new Date().toISOString(),
      };

      // Notify only the users who booked this event
      for (const userId of bookedUserIds) {
        this._notificationService.notifyUser(
          userId,
          'event_live',
          notificationPayload,
        );
        this._notificationService.notifyUser(
          userId,
          'notification',
          notificationPayload,
        );
      }
    } catch (notificationError) {
      logger.error(
        `Failed to dispatch live event notifications: ${String(notificationError)}`,
      );
    }

    return eventMapper.toResponse(updatedEvent);
  }
}
