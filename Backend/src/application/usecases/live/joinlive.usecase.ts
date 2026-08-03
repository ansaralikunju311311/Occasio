import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../domain/repositories/booking/booking.repository.interface';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import { AppError } from '../../../common/errors/apperror';
import { HttpStatus } from '../../../common/constants/http-status';
import type { JoinLiveResponseDto } from '../../dtos/live.dto';

export class JoinLiveUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
  ) {}

  async execute(eventId: string, userId: string): Promise<JoinLiveResponseDto> {
    const event = await this._eventRepository.findByIdEvents(eventId);

    if (!event) {
      throw new AppError('Event not found', HttpStatus.NOT_FOUND);
    }

    if (event.isDeleted) {
      throw new AppError('Event has been deleted', HttpStatus.BAD_REQUEST);
    }

    const isCreator = event.createdBy.toString() === userId;

    if (isCreator) {
      return {
        eventId: event.id || eventId,
        title: event.title,
        isLive: event.status === EventStatus.LIVE,
        role: 'publisher',
        canWatch: true,
      };
    }

    // Booked user checks
    if (event.status !== EventStatus.LIVE) {
      throw new AppError('Event is not currently LIVE', HttpStatus.BAD_REQUEST);
    }

    const confirmedBookings = await this._bookingRepository.findConfirmedBookingsByEventId(eventId);
    const hasBooking = confirmedBookings.some((b) => {
      if (!b.userId) return false;
      const u = b.userId as any;
      const bUserId = typeof u === 'string' ? u : u._id ? u._id.toString() : u.toString();
      return bUserId === userId;
    });

    if (!hasBooking) {
      throw new AppError(
        'Access denied: You must have a confirmed booking for this event to join the live stream',
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      eventId: event.id || eventId,
      title: event.title,
      isLive: true,
      role: 'viewer',
      canWatch: true,
    };
  }
}
