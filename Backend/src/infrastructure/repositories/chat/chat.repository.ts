import type { IChatRepository } from '../../../domain/repositories/chat/chat.repository.interface';
import { ChatMessage } from '../../../domain/entities/chat.entity';
import { ChatModel } from '../../database/model/chat.model';
import { chatMapper } from '../../../common/mappers/chat.mapper';

export class ChatRepository implements IChatRepository {
  async saveMessage(chatMessage: ChatMessage): Promise<ChatMessage> {
    const doc = await ChatModel.create(chatMapper.toPersistence(chatMessage));

    return chatMapper.toDomain(doc.toObject() as unknown as Record<string, unknown>);
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
      (doc) => chatMapper.toDomain(doc.toObject() as unknown as Record<string, unknown>)
    );
  }
}
