import { api } from './api';

export interface JoinLiveSessionData {
  eventId: string;
  title: string;
  isLive: boolean;
  role: 'publisher' | 'viewer';
  canWatch: boolean;
}

export interface ChatMessageData {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export const liveService = {
  async startLive(eventId: string) {
    const res = await api.patch(`/live/${eventId}/start-live`);
    return res.data;
  },

  async endLive(eventId: string) {
    const res = await api.patch(`/live/${eventId}/end-live`);
    return res.data;
  },

  async joinLive(eventId: string): Promise<JoinLiveSessionData> {
    const res = await api.post(`/live/${eventId}/join-live`);
    return res.data.liveSession;
  },

  async getChatHistory(eventId: string): Promise<ChatMessageData[]> {
    const res = await api.get(`/live/${eventId}/chat`);
    return res.data.messages || [];
  },

  async sendChatMessage(eventId: string, message: string): Promise<ChatMessageData> {
    const res = await api.post(`/live/${eventId}/chat`, { message });
    return res.data.chatMessage;
  },
};
