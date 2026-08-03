import type { IChatRepository } from '../../../domain/repositories/chat/chat.repository.interface';
import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../domain/repositories/booking/booking.repository.interface';
import { AppError } from '../../../common/errors/apperror';
import { HttpStatus } from '../../../common/constants/http-status';
import type { ChatMessageResponseDto } from '../../dtos/live.dto';

export class GetChatHistoryUseCase {
  constructor(
    private _chatRepository: IChatRepository,
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
  ) {}

  async execute(eventId: string, userId: string): Promise<ChatMessageResponseDto[]> {
    const event = await this._eventRepository.findByIdEvents(eventId);
    if (!event) {
      throw new AppError('Event not found', HttpStatus.NOT_FOUND);
    }

    const isCreator = event.createdBy.toString() === userId;
    if (!isCreator) {
      const confirmedBookings = await this._bookingRepository.findConfirmedBookingsByEventId(eventId);
      const hasBooking = confirmedBookings.some((b) => {
        if (!b.userId) return false;
        const u = b.userId as unknown as string | { _id?: { toString(): string } };
        const bUserId = typeof u === 'string' ? u : u._id ? u._id.toString() : u.toString();
        return bUserId === userId;
      });

      if (!hasBooking) {
        throw new AppError('Access denied: Confirmed booking required to view chat history', HttpStatus.FORBIDDEN);
      }
    }

    const messages = await this._chatRepository.getMessagesByEventId(eventId, 100);

    return messages.map((m) => ({
      id: m.id || '',
      eventId: m.eventId,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));
  }
}
