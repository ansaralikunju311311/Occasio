import React, { useEffect, useRef } from 'react';

interface LocalVideoProps {
  stream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoOff: boolean;
}

export const LocalVideo: React.FC<LocalVideoProps> = ({
  stream,
  isAudioMuted,
  isVideoOff,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group">
      {/* Video Element */}
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // Always mute local video preview to prevent audio feedback loop
          className="w-full h-full object-cover transform -scale-x-100" // Mirror local preview
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 p-8">
          <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-4 border border-slate-700/50 shadow-inner">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-400">
            {isVideoOff ? 'Camera Turned Off' : 'Waiting for Camera Stream...'}
          </p>
        </div>
      )}

      {/* Live Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/50 text-xs font-semibold text-white shadow-lg">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
        <span>LIVE PREVIEW</span>
      </div>

      {/* Status Badges */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        {isAudioMuted && (
          <span className="bg-rose-500/90 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-md font-medium flex items-center gap-1 shadow-md">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
            </svg>
            Muted
          </span>
        )}
        {isVideoOff && (
          <span className="bg-amber-500/90 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-md font-medium flex items-center gap-1 shadow-md">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Video Off
          </span>
        )}
      </div>
    </div>
  );
};
