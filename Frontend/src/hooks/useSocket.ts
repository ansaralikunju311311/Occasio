import { useEffect } from 'react';
import { socket } from '../services/socket/socket';
import { toast } from 'sonner';
import { useNotifications } from '../context/NotificationContext';

export interface EventLiveNotificationData {
  eventId?: string;
  eventTitle?: string;
  message?: string;
  timestamp?: string;
}

export const useSocket = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const syncSocketConnection = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        if (socket.connected) {
          console.log('🔒 Disconnecting socket (no access token found)');
          socket.disconnect();
        }
        return;
      }

      // Update auth token if socket auth is missing or changed
      const currentAuth = socket.auth as { token?: string } | undefined;
      const currentToken = currentAuth?.token;
      if (currentToken !== token) {
        socket.auth = { token };
        if (socket.connected) {
          socket.disconnect();
        }
      }

      if (!socket.connected) {
        socket.connect();
      }
    };

    syncSocketConnection();

    const handleConnect = () => {
      console.log('⚡ Socket connected successfully:', socket.id);
    };

    const handleConnectError = (err: Error) => {
      console.error('❌ Socket connection error:', err.message);
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔌 Socket disconnected:', reason);
    };

    let lastHandledEventId: string | null = null;
    let lastHandledTime = 0;

    const handleEventLive = (data: EventLiveNotificationData) => {
      const now = Date.now();
      if (data.eventId && data.eventId === lastHandledEventId && now - lastHandledTime < 5000) {
        return;
      }
      lastHandledEventId = data.eventId || null;
      lastHandledTime = now;

      console.log('🔴 Received live event notification:', data);

      addNotification({
        type: 'EVENT_LIVE',
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        message: data.message || `🔴 Event "${data.eventTitle}" is now LIVE!`,
        timestamp: data.timestamp || new Date().toISOString(),
      });

      toast.info(data.message || 'An event you booked is now LIVE!', {
        duration: 10000,
        description: data.eventTitle
          ? `Event "${data.eventTitle}" is now streaming!`
          : undefined,
        action: data.eventId
          ? {
              label: 'Join Event',
              onClick: () => {
                window.location.href = `/event/${data.eventId}`;
              },
            }
          : undefined,
      });
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on('event_live', handleEventLive);
    socket.on('notification', handleEventLive);

    // Periodically check if access token appeared or changed (e.g. after user login)
    const checkInterval = setInterval(syncSocketConnection, 2000);

    return () => {
      clearInterval(checkInterval);
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off('event_live', handleEventLive);
      socket.off('notification', handleEventLive);
    };
  }, [addNotification]);

  return socket;
};