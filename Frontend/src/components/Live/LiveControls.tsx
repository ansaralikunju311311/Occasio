import React from 'react';

interface LiveControlsProps {
  isStreaming: boolean;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  viewerCount: number;
  onStartLive: () => void;
  onEndLive: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

export const LiveControls: React.FC<LiveControlsProps> = ({
  isStreaming,
  isAudioMuted,
  isVideoOff,
  viewerCount,
  onStartLive,
  onEndLive,
  onToggleAudio,
  onToggleVideo,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
      {/* Left: Viewer Count Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/50 text-xs font-semibold text-slate-300">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{viewerCount} Viewers</span>
        </div>
      </div>

      {/* Center: Audio / Video Toggles */}
      {isStreaming && (
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAudio}
            className={`p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              isAudioMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-200 border border-slate-700/60 hover:bg-slate-700'
            }`}
            title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isAudioMuted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              isVideoOff
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-200 border border-slate-700/60 hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
          >
            {isVideoOff ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Right: Start Live / End Live Primary Buttons */}
      <div>
        {!isStreaming ? (
          <button
            onClick={onStartLive}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            Start Live Stream
          </button>
        ) : (
          <button
            onClick={onEndLive}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/30 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Stream
          </button>
        )}
      </div>
    </div>
  );
};
