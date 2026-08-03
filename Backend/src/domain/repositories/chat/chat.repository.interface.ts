import type { ChatMessage } from '../../entities/chat.entity';

export interface IChatRepository {
  saveMessage(chatMessage: ChatMessage): Promise<ChatMessage>;
  getMessagesByEventId(eventId: string, limit?: number): Promise<ChatMessage[]>;
}
