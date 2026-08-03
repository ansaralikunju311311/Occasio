import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessageData } from '../../services/live.service';

interface LiveChatProps {
  messages: ChatMessageData[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  currentUserId?: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  currentUserId,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSendMessage(inputText);
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-sm font-bold text-white tracking-wide">Live Chat</h3>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 font-mono">
          {messages.length} msgs
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar min-h-[300px] max-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
            <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
            <p className="text-xs">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12 text-center">
            <p className="text-sm font-medium text-slate-400 mb-1">No messages yet</p>
            <p className="text-xs text-slate-600">Be the first to leave a message in the stream!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const isOrganizer = msg.senderRole === 'EVENT_MANAGER' || msg.senderRole === 'ORGANIZER';

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">{msg.senderName}</span>
                  {isOrganizer && (
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.5 rounded font-bold border border-rose-500/30">
                      HOST
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-sm break-words leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                      : isOrganizer
                        ? 'bg-slate-800/90 text-rose-100 border border-rose-500/30 rounded-tl-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950/80 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Say something to the host..."
            maxLength={500}
            className="flex-1 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-md flex items-center justify-center"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
