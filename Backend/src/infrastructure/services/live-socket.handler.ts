import type { Server, Socket } from 'socket.io';
import { logger } from '../../common/logger/logger';

// Track viewer counts for active live event rooms
const roomViewerCounts: Map<string, Set<string>> = new Map();

export const registerLiveSocketHandler = (io: Server, socket: Socket): void => {
  const userId = socket.data.user?.userId || socket.data.user?.id;

  // Join live room
  socket.on('join_live_room', ({ eventId }: { eventId: string }) => {
    if (!eventId) return;

    const roomName = `live_event_${eventId}`;
    socket.join(roomName);

    if (!roomViewerCounts.has(eventId)) {
      roomViewerCounts.set(eventId, new Set());
    }

    const viewersSet = roomViewerCounts.get(eventId)!;
    viewersSet.add(socket.id);

    const count = viewersSet.size;
    logger.info(`[LiveSocket] Socket ${socket.id} (User: ${userId}) joined room ${roomName}. Total viewers: ${count}`);

    // Emit updated viewer count to room
    io.to(roomName).emit('viewer_count_update', { eventId, count });

    // Notify room/publisher that a new viewer joined
    socket.to(roomName).emit('viewer_joined', {
      viewerSocketId: socket.id,
      viewerUserId: userId,
      eventId,
    });
  });

  // Leave live room
  socket.on('leave_live_room', ({ eventId }: { eventId: string }) => {
    if (!eventId) return;

    const roomName = `live_event_${eventId}`;
    socket.leave(roomName);

    if (roomViewerCounts.has(eventId)) {
      const viewersSet = roomViewerCounts.get(eventId)!;
      viewersSet.delete(socket.id);
      const count = viewersSet.size;

      io.to(roomName).emit('viewer_count_update', { eventId, count });
    }

    socket.to(roomName).emit('viewer_left', {
      viewerSocketId: socket.id,
      viewerUserId: userId,
      eventId,
    });
  });

  // WebRTC Offer Relay
  socket.on('webrtc_offer', ({ targetSocketId, offer, eventId }: { targetSocketId: string; offer: Record<string, unknown>; eventId: string }) => {
    if (!targetSocketId || !offer) return;
    io.to(targetSocketId).emit('webrtc_offer', {
      senderSocketId: socket.id,
      offer,
      eventId,
    });
  });

  // WebRTC Answer Relay
  socket.on('webrtc_answer', ({ targetSocketId, answer, eventId }: { targetSocketId: string; answer: Record<string, unknown>; eventId: string }) => {
    if (!targetSocketId || !answer) return;
    io.to(targetSocketId).emit('webrtc_answer', {
      senderSocketId: socket.id,
      answer,
      eventId,
    });
  });

  // WebRTC ICE Candidate Relay
  socket.on('webrtc_ice_candidate', ({ targetSocketId, candidate, eventId }: { targetSocketId: string; candidate: Record<string, unknown>; eventId: string }) => {
    if (!targetSocketId || !candidate) return;
    io.to(targetSocketId).emit('webrtc_ice_candidate', {
      senderSocketId: socket.id,
      candidate,
      eventId,
    });
  });

  // Realtime Chat Broadcast
  socket.on('chat_message_broadcast', ({ eventId, message }: { eventId: string; message: Record<string, unknown> }) => {
    if (!eventId || !message) return;
    const roomName = `live_event_${eventId}`;
    io.to(roomName).emit('receive_chat_message', message);
  });

  // Handle Disconnect
  socket.on('disconnecting', () => {
    for (const roomName of socket.rooms) {
      if (roomName.startsWith('live_event_')) {
        const eventId = roomName.replace('live_event_', '');
        if (roomViewerCounts.has(eventId)) {
          const viewersSet = roomViewerCounts.get(eventId)!;
          viewersSet.delete(socket.id);
          const count = viewersSet.size;
          io.to(roomName).emit('viewer_count_update', { eventId, count });
        }
        socket.to(roomName).emit('viewer_left', {
          viewerSocketId: socket.id,
          viewerUserId: userId,
          eventId,
        });
      }
    }
  });
};
