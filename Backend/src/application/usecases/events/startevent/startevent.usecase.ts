import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import { EventStatus } from '../../../../common/enums/eventstatus-enum';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import { socketService } from '../../../../infrastructure/services/socket.service';
import type { IStartEventUseCase } from './startevent.usecase.interface';

export class StartEventUseCase implements IStartEventUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
  ) {}

  async execute(eventId: string, managerId: string): Promise<EventResponseDto> {
    const event = await this._eventRepository.findByIdEvents(eventId);

    if (!event) {
      throw new AppError('Event not found', HttpStatus.NOT_FOUND);
    }

    if (event.isDeleted) {
      throw new AppError('Event has been deleted', HttpStatus.BAD_REQUEST);
    }

    if (event.createdBy.toString() !== managerId) {
      throw new AppError('You are not authorized to start this event', HttpStatus.FORBIDDEN);
    }

    if (event.status === EventStatus.LIVE) {
      throw new AppError('Event is already LIVE', HttpStatus.BAD_REQUEST);
    }

    if (event.status !== EventStatus.ACTIVE) {
      throw new AppError(
        `Cannot start event with status ${event.status}. Only ACTIVE events can be started.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedEvent = await this._eventRepository.updateEvent(eventId, {
      status: EventStatus.LIVE,
    });

    if (!updatedEvent) {
      throw new AppError('Failed to update event status', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Send real-time Socket.IO notification to all users who booked this event
    try {
      const bookings = await this._bookingRepository.findConfirmedBookingsByEventId(eventId);
      const bookedUserIds = Array.from(
        new Set(
          bookings
            .map((b) => {
              if (!b.userId) return '';
              const u = b.userId as unknown as string | { _id?: { toString(): string } };
              if (typeof u === 'string') return u;
              if (u._id) return u._id.toString();
              return u.toString();
            })
            .filter(Boolean),
        ),
      );

      console.log(`[StartEventUseCase] Found ${bookings.length} confirmed bookings for event ${eventId}. Notifying user IDs:`, bookedUserIds);

      const notificationPayload = {
        type: 'EVENT_LIVE',
        eventId: updatedEvent.id,
        eventTitle: updatedEvent.title,
        message: `🔴 Event "${updatedEvent.title}" is now LIVE!`,
        timestamp: new Date().toISOString(),
      };

      // Notify only the users who booked this event
      for (const userId of bookedUserIds) {
        socketService.notifyUser(userId, 'event_live', notificationPayload);
        socketService.notifyUser(userId, 'notification', notificationPayload);
      }
    } catch (notificationError) {
      console.error('Failed to dispatch live event notifications:', notificationError);
    }

    return eventMapper.toResponse(updatedEvent);
  }
}
