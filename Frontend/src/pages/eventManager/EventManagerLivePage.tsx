import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveService } from '../../services/live.service';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useLiveChat } from '../../hooks/useLiveChat';
import { LocalVideo } from '../../components/Live/LocalVideo';
import { LiveControls } from '../../components/Live/LiveControls';
import { LiveChat } from '../../components/Live/LiveChat';
import { useEventDetails } from '../../hooks/useEvents';
import { toast } from 'sonner';
import { useAppSelector } from '../../redux/hook';

const EventManagerLivePage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const { data: event, isLoading: isLoadingDetails } = useEventDetails(eventId);
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    localStream,
    isAudioMuted,
    isVideoOff,
    viewerCount,
    initLocalStream,
    toggleAudio,
    toggleVideo,
    cleanup,
  } = useWebRTC({
    eventId: eventId || '',
    role: 'publisher',
  });

  const { messages, isLoading: isLoadingChat, sendMessage } = useLiveChat(eventId || '');

  // Check if event is already live
  useEffect(() => {
    if (event?.status === 'LIVE') {
      setIsStreaming(true);
      initLocalStream().catch(() => {
        toast.error('Could not access camera/microphone');
      });
    }
  }, [event?.status, initLocalStream]);

  const handleStartLive = async () => {
    if (!eventId) return;
    try {
      await initLocalStream();
      await liveService.startLive(eventId);
      setIsStreaming(true);
      toast.success('Live stream started successfully! Viewers have been notified.');
    } catch (err: any) {
      console.error('Failed to start live stream:', err);
      toast.error(err?.response?.data?.message || 'Failed to start live stream');
    }
  };

  const handleEndLive = useCallback(async () => {
    if (!eventId) return;
    try {
      await liveService.endLive(eventId);
      cleanup();
      setIsStreaming(false);
      toast.info('Live stream has ended.');
      navigate('/eventmanager/my-events');
    } catch (err: any) {
      console.error('Failed to end live stream:', err);
      toast.error(err?.response?.data?.message || 'Failed to end live stream');
    }
  }, [eventId, cleanup, navigate]);

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm animate-pulse">Loading event studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Event Studio
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">{event?.title || 'Live Stream'}</h1>
            </div>
            <p className="text-xs text-slate-400 font-light">
              Broadcast high-quality video and audio directly to your booked attendees via WebRTC.
            </p>
          </div>

          <button
            onClick={() => navigate('/eventmanager/my-events')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-all border border-slate-700/50 self-start sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Main Grid: Video Studio + Live Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Stream Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full">
              <LocalVideo
                stream={localStream}
                isAudioMuted={isAudioMuted}
                isVideoOff={isVideoOff}
              />
            </div>

            {/* Studio Controls Bar */}
            <LiveControls
              isStreaming={isStreaming}
              isAudioMuted={isAudioMuted}
              isVideoOff={isVideoOff}
              viewerCount={viewerCount}
              onStartLive={handleStartLive}
              onEndLive={handleEndLive}
              onToggleAudio={toggleAudio}
              onToggleVideo={toggleVideo}
            />
          </div>

          {/* Realtime Chat Column */}
          <div className="lg:col-span-1 h-[600px] lg:h-auto">
            <LiveChat
              messages={messages}
              isLoading={isLoadingChat}
              onSendMessage={sendMessage}
              currentUserId={authUser?.id || (authUser as any)?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagerLivePage;
