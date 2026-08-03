import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../services/socket/socket';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface UseWebRTCOptions {
  eventId: string;
  role: 'publisher' | 'viewer';
}

export const useWebRTC = ({ eventId, role }: UseWebRTCOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const publisherPeerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const viewerPeerConnection = useRef<RTCPeerConnection | null>(null);

  // Initialize Publisher Media Stream
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsConnected(true);
      return stream;
    } catch (err) {
      console.error('[WebRTC] Failed to access camera/microphone:', err);
      throw err;
    }
  }, []);

  // Publisher: Mute/Unmute Audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Publisher: Toggle Video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, []);

  // Stop Media & Clean Connections
  const cleanup = useCallback(() => {
    console.log('[WebRTC] Cleaning up WebRTC streams & peer connections');
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    publisherPeerConnections.current.forEach((pc) => pc.close());
    publisherPeerConnections.current.clear();

    if (viewerPeerConnection.current) {
      viewerPeerConnection.current.close();
      viewerPeerConnection.current = null;
    }

    setRemoteStream(null);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!eventId) return;

    if (!socket.connected) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    }

    // Join room signaling
    socket.emit('join_live_room', { eventId });

    // Handle Viewer Count Updates
    const handleViewerCountUpdate = ({ count }: { count: number }) => {
      setViewerCount(count);
    };

    // --- PUBLISHER HANDLERS ---
    const handleViewerJoined = async ({ viewerSocketId }: { viewerSocketId: string }) => {
      if (role !== 'publisher' || !localStreamRef.current) return;

      console.log('[WebRTC Publisher] Viewer joined:', viewerSocketId);
      const pc = new RTCPeerConnection(ICE_SERVERS);
      publisherPeerConnections.current.set(viewerSocketId, pc);

      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc_ice_candidate', {
            targetSocketId: viewerSocketId,
            candidate: event.candidate,
            eventId,
          });
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc_offer', {
          targetSocketId: viewerSocketId,
          offer,
          eventId,
        });
      } catch (err) {
        console.error('[WebRTC Publisher] Error creating offer:', err);
      }
    };

    const handleAnswerFromViewer = async ({
      senderSocketId,
      answer,
    }: {
      senderSocketId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      if (role !== 'publisher') return;
      const pc = publisherPeerConnections.current.get(senderSocketId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleIceCandidateFromViewer = async ({
      senderSocketId,
      candidate,
    }: {
      senderSocketId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      if (role !== 'publisher') return;
      const pc = publisherPeerConnections.current.get(senderSocketId);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleViewerLeft = ({ viewerSocketId }: { viewerSocketId: string }) => {
      if (role !== 'publisher') return;
      const pc = publisherPeerConnections.current.get(viewerSocketId);
      if (pc) {
        pc.close();
        publisherPeerConnections.current.delete(viewerSocketId);
      }
    };

    // --- VIEWER HANDLERS ---
    const handleOfferFromPublisher = async ({
      senderSocketId,
      offer,
    }: {
      senderSocketId: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      if (role !== 'viewer') return;

      console.log('[WebRTC Viewer] Received offer from publisher:', senderSocketId);
      if (viewerPeerConnection.current) {
        viewerPeerConnection.current.close();
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      viewerPeerConnection.current = pc;

      pc.ontrack = (event) => {
        console.log('[WebRTC Viewer] Received remote track:', event.track.kind);
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          setIsConnected(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc_ice_candidate', {
            targetSocketId: senderSocketId,
            candidate: event.candidate,
            eventId,
          });
        }
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('webrtc_answer', {
          targetSocketId: senderSocketId,
          answer,
          eventId,
        });
      } catch (err) {
        console.error('[WebRTC Viewer] Error answering offer:', err);
      }
    };

    const handleIceCandidateFromPublisher = async ({
      senderSocketId: _senderSocketId,
      candidate,
    }: {
      senderSocketId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      if (role !== 'viewer') return;
      if (viewerPeerConnection.current) {
        await viewerPeerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on('viewer_count_update', handleViewerCountUpdate);
    socket.on('viewer_joined', handleViewerJoined);
    socket.on('webrtc_answer', handleAnswerFromViewer);
    socket.on('webrtc_ice_candidate', handleIceCandidateFromViewer);
    socket.on('viewer_left', handleViewerLeft);

    socket.on('webrtc_offer', handleOfferFromPublisher);
    if (role === 'viewer') {
      socket.on('webrtc_ice_candidate', handleIceCandidateFromPublisher);
    }

    return () => {
      socket.emit('leave_live_room', { eventId });
      socket.off('viewer_count_update', handleViewerCountUpdate);
      socket.off('viewer_joined', handleViewerJoined);
      socket.off('webrtc_answer', handleAnswerFromViewer);
      socket.off('webrtc_ice_candidate', handleIceCandidateFromViewer);
      socket.off('viewer_left', handleViewerLeft);
      socket.off('webrtc_offer', handleOfferFromPublisher);
      socket.off('webrtc_ice_candidate', handleIceCandidateFromPublisher);
      cleanup();
    };
  }, [eventId, role, cleanup]);

  return {
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoOff,
    viewerCount,
    isConnected,
    initLocalStream,
    toggleAudio,
    toggleVideo,
    cleanup,
  };
};
