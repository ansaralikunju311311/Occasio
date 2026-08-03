import { useEffect, useState, useCallback } from 'react';
import { liveService, type ChatMessageData } from '../services/live.service';
import { socket } from '../services/socket/socket';
import { toast } from 'sonner';

export const useLiveChat = (eventId: string) => {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!eventId) return;
    try {
      setIsLoading(true);
      const history = await liveService.getChatHistory(eventId);
      setMessages(history);
    } catch (err: any) {
      console.error('[LiveChat] Failed to load chat history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadChatHistory();

    const handleReceiveMessage = (message: ChatMessageData) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on('receive_chat_message', handleReceiveMessage);

    return () => {
      socket.off('receive_chat_message', handleReceiveMessage);
    };
  }, [eventId, loadChatHistory]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text || !text.trim() || !eventId) return;
      try {
        const savedMessage = await liveService.sendChatMessage(eventId, text.trim());
        setMessages((prev) => [...prev, savedMessage]);

        // Broadcast to live room via Socket.IO
        socket.emit('chat_message_broadcast', {
          eventId,
          message: savedMessage,
        });
      } catch (err: any) {
        console.error('[LiveChat] Error sending message:', err);
        toast.error(err?.response?.data?.message || 'Failed to send chat message');
      }
    },
    [eventId],
  );

  return {
    messages,
    isLoading,
    sendMessage,
    reloadChat: loadChatHistory,
  };
};
