import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveService, type JoinLiveSessionData } from '../../services/live.service';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useLiveChat } from '../../hooks/useLiveChat';
import { RemoteVideo } from '../../components/Live/RemoteVideo';
import { LiveChat } from '../../components/Live/LiveChat';
import { socket } from '../../services/socket/socket';
import { toast } from 'sonner';
import { useAppSelector } from '../../redux/hook';

const UserLivePage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const [session, setSession] = useState<JoinLiveSessionData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isStreamEnded, setIsStreamEnded] = useState(false);

  const { remoteStream, viewerCount } = useWebRTC({
    eventId: eventId || '',
    role: 'viewer',
  });

  const { messages, isLoading: isLoadingChat, sendMessage } = useLiveChat(eventId || '');

  // Verify Booking Access & Join Live Session
  useEffect(() => {
    if (!eventId) return;

    const verifyAccess = async () => {
      try {
        setIsVerifying(true);
        setAccessError(null);
        const liveSessionData = await liveService.joinLive(eventId);
        setSession(liveSessionData);
      } catch (err: unknown) {
        console.error('[UserLivePage] Join live error:', err);
        const e = err as { response?: { data?: { message?: string } } };
        const msg =
          e?.response?.data?.message ||
          'You must have a confirmed booking for this event to watch the stream.';
        setAccessError(msg);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [eventId]);

  // Handle Event Ended Socket Signal
  useEffect(() => {
    const handleEventEnded = (data: { eventId: string; message: string }) => {
      if (data.eventId === eventId) {
        setIsStreamEnded(true);
        toast.info('The live stream has been ended by the host.');
      }
    };

    socket.on('event_ended', handleEventEnded);

    return () => {
      socket.off('event_ended', handleEventEnded);
    };
  }, [eventId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm animate-pulse font-light">
          Verifying event booking & credentials...
        </p>
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 px-6 text-center text-white">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 shadow-2xl">
          <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
          {accessError}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/event/${eventId}`)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/30"
          >
            View Event & Book Ticket
          </button>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl transition-all text-sm"
          >
            Browse Events
          </button>
        </div>
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
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">{session?.title || 'Live Stream'}</h1>
            </div>
            <p className="text-xs text-slate-400 font-light">
              You are watching the live stream using pure browser WebRTC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/50 text-xs font-semibold text-slate-300">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{viewerCount} Watching</span>
            </div>

            <button
              onClick={() => navigate(`/event/${eventId}`)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-all border border-slate-700/50"
            >
              Exit Live
            </button>
          </div>
        </div>

        {/* Main Grid: Live Video + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Remote Video Viewer */}
          <div className="lg:col-span-2">
            <div className="aspect-video w-full">
              <RemoteVideo
                stream={remoteStream}
                eventTitle={session?.title || 'Live Event'}
                isLive={!isStreamEnded}
              />
            </div>
          </div>

          {/* Realtime Live Chat */}
          <div className="lg:col-span-1 h-[600px] lg:h-auto">
            <LiveChat
              messages={messages}
              isLoading={isLoadingChat}
              onSendMessage={sendMessage}
              currentUserId={authUser?.id || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLivePage;
