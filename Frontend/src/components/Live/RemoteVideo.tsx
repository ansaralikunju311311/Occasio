import React, { useEffect, useRef, useState } from 'react';

interface RemoteVideoProps {
  stream: MediaStream | null;
  eventTitle: string;
  isLive: boolean;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  stream,
  eventTitle,
  isLive,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleVolume = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group"
    >
      {stream && isLive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner animate-pulse">
            <svg
              className="w-12 h-12 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 10.5l4.72-2.36a.75.75 0 011.03.688v8.342a.75.75 0 01-1.03.688L15.75 15.5m-4.5-6H4.5A2.25 2.25 0 002.25 11.75v4.5A2.25 2.25 0 004.5 18.5h6.75a2.25 2.25 0 002.25-2.25v-4.5a2.25 2.25 0 00-2.25-2.25z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{eventTitle}</h3>
          <p className="text-slate-400 max-w-sm text-sm font-light">
            {isLive
              ? 'Connecting to WebRTC live media stream...'
              : 'The live stream has ended or is currently waiting to start.'}
          </p>
        </div>
      )}

      {/* Top Status Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-rose-600/90 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </span>
          <h4 className="text-white text-sm font-medium drop-shadow-md hidden sm:block truncate max-w-xs">
            {eventTitle}
          </h4>
        </div>
      </div>

      {/* Bottom Overlay Controls */}
      {stream && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-lg px-4 py-2.5 rounded-xl border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVolume}
              className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <svg className="w-5 h-5 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
