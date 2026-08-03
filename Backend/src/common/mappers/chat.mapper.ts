import { ChatMessage } from '../../domain/entities/chat.entity';

export class ChatMapper {
  toDomain(doc: Record<string, unknown>): ChatMessage {
    return new ChatMessage(
      (doc._id as { toString(): string })?.toString() ||
        (doc.id as string) ||
        null,
      (doc.eventId as { toString(): string })?.toString() || String(doc.eventId || ''),
      (doc.senderId as { toString(): string })?.toString() || String(doc.senderId || ''),
      doc.senderName as string,
      doc.senderRole as string,
      doc.message as string,
      doc.createdAt as Date,
    );
  }

  toPersistence(entity: ChatMessage): Record<string, unknown> {
    return {
      eventId: entity.eventId,
      senderId: entity.senderId,
      senderName: entity.senderName,
      senderRole: entity.senderRole,
      message: entity.message,
    };
  }
}

export const chatMapper = new ChatMapper();
