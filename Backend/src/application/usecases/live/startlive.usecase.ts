import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../domain/repositories/booking/booking.repository.interface';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import { AppError } from '../../../common/errors/apperror';
import { HttpStatus } from '../../../common/constants/http-status';
import { socketService } from '../../../infrastructure/services/socket.service';
import { eventMapper } from '../../../common/mappers/event.mapper';
import type { EventResponseDto } from '../../dtos/responses/event-response.dto';

export class StartLiveUseCase {
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
      throw new AppError('You are not authorized to start live for this event', HttpStatus.FORBIDDEN);
    }

    if (event.status === EventStatus.LIVE) {
      // If already live, return current event
      return eventMapper.toResponse(event);
    }

    const updatedEvent = await this._eventRepository.updateEvent(eventId, {
      status: EventStatus.LIVE,
    });

    if (!updatedEvent) {
      throw new AppError('Failed to update event status to LIVE', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Send realtime notification to all users with confirmed bookings
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

      const notificationPayload = {
        type: 'EVENT_LIVE',
        eventId: updatedEvent.id,
        eventTitle: updatedEvent.title,
        message: `🔴 Event "${updatedEvent.title}" is now LIVE!`,
        timestamp: new Date().toISOString(),
      };

      for (const userId of bookedUserIds) {
        socketService.notifyUser(userId, 'event_live', notificationPayload);
        socketService.notifyUser(userId, 'notification', notificationPayload);
      }
    } catch (notificationError) {
      console.error('[StartLiveUseCase] Failed to send live event notifications:', notificationError);
    }

    return eventMapper.toResponse(updatedEvent);
  }
}
