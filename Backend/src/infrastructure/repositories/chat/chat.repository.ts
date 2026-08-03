import type { IChatRepository } from '../../../domain/repositories/chat/chat.repository.interface';
import { ChatMessage } from '../../../domain/entities/chat.entity';
import { ChatModel } from '../../database/model/chat.model';

export class ChatRepository implements IChatRepository {
  async saveMessage(chatMessage: ChatMessage): Promise<ChatMessage> {
    const doc = await ChatModel.create({
      eventId: chatMessage.eventId,
      senderId: chatMessage.senderId,
      senderName: chatMessage.senderName,
      senderRole: chatMessage.senderRole,
      message: chatMessage.message,
    });

    return new ChatMessage(
      doc._id.toString(),
      doc.eventId.toString(),
      doc.senderId.toString(),
      doc.senderName,
      doc.senderRole,
      doc.message,
      doc.createdAt,
    );
  }

  async getMessagesByEventId(
    eventId: string,
    limit = 100,
  ): Promise<ChatMessage[]> {
    const docs = await ChatModel.find({ eventId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .exec();

    return docs.map(
      (doc) =>
        new ChatMessage(
          doc._id.toString(),
          doc.eventId.toString(),
          doc.senderId.toString(),
          doc.senderName,
          doc.senderRole,
          doc.message,
          doc.createdAt,
        ),
    );
  }
}
