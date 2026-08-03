import type { IChatRepository } from '../../../domain/repositories/chat/chat.repository.interface';
import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import type { IBookingRepository } from '../../../domain/repositories/booking/booking.repository.interface';
import { ChatMessage } from '../../../domain/entities/chat.entity';
import { AppError } from '../../../common/errors/apperror';
import { HttpStatus } from '../../../common/constants/http-status';
import type { ChatMessageResponseDto } from '../../dtos/live.dto';

export class SendChatMessageUseCase {
  constructor(
    private _chatRepository: IChatRepository,
    private _eventRepository: IEventRepository,
    private _bookingRepository: IBookingRepository,
  ) {}

  async execute(
    eventId: string,
    userId: string,
    senderName: string,
    senderRole: string,
    messageContent: string,
  ): Promise<ChatMessageResponseDto> {
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
        throw new AppError('You must have a confirmed booking to post messages', HttpStatus.FORBIDDEN);
      }
    }

    const chatEntity = new ChatMessage(
      null,
      eventId,
      userId,
      senderName,
      senderRole,
      messageContent,
    );

    const saved = await this._chatRepository.saveMessage(chatEntity);

    return {
      id: saved.id || '',
      eventId: saved.eventId,
      senderId: saved.senderId,
      senderName: saved.senderName,
      senderRole: saved.senderRole,
      message: saved.message,
      createdAt: saved.createdAt.toISOString(),
    };
  }
}
