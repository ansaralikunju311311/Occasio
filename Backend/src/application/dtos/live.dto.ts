export interface JoinLiveResponseDto {
  eventId: string;
  title: string;
  isLive: boolean;
  role: 'publisher' | 'viewer';
  canWatch: boolean;
}

export interface SendChatMessageDto {
  eventId: string;
  message: string;
}

export interface ChatMessageResponseDto {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}
