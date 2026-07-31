import React, { useState } from 'react';
import { useStartEvent } from '../../hooks/useEvents';
import { toast } from 'sonner';

interface EventDetailsModalProps {
  event: any;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  const startMutation = useStartEvent();
  const [isStarting, setIsStarting] = useState(false);

  if (!event) return null;

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startMutation.mutateAsync(event.id);
      toast.success('Event is now LIVE!');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to start event.');
    } finally {
      setIsStarting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'LIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'UPCOMING':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'ENDED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getFormatStyle = (format: string) => {
    switch (format) {
      case 'ONLINE':
        return 'text-sky-400 bg-sky-400/10 border border-sky-400/20';
      case 'OFFLINE':
        return 'text-amber-400 bg-amber-400/10 border border-amber-400/20';
      case 'HYBRID':
        return 'text-purple-400 bg-purple-400/10 border border-purple-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border border-slate-400/20';
    }
  };

  const blocks =
    event?.SeatLayout?.blocks ??
    event?.seatLayout?.blocks ??
    event?.seatLayoutDetails?.blocks ??
    event?.layout?.blocks ??
    [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[#0a0f16] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              {event.title}
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getStatusStyle(event.status)}`}
              >
                {event.status || 'UNKNOWN'}
              </span>
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-slate-500 font-mono" title={event.id}>
                ID: {event.id}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getFormatStyle(event.eventType)}`}
              >
                {event.eventType || 'UNKNOWN'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Image & Basic Details */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex justify-center items-center relative group">
                {event.picture ? (
                  <img
                    src={event.picture}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-600 flex flex-col items-center">
                    <svg
                      className="w-10 h-10 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs">No Cover Image</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Creator Details
                </h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-500 mr-2">Name:</span>{' '}
                    {event.creatorDetails?.name || 'Unknown'}
                  </p>
                  <p>
                    <span className="text-slate-500 mr-2">Email:</span>{' '}
                    {event.creatorDetails?.email || 'N/A'}
                  </p>
                </div>
              </div>

              {(event.eventType === 'ONLINE' || event.eventType === 'HYBRID') && (
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-3">Online Details</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-500 mr-2">Base Ticket Price:</span>{' '}
                      <span className="text-emerald-400 font-semibold">
                        {event.price > 0 ? `₹${event.price}` : 'Free'}
                      </span>
                    </p>
                    {event.maxOnlineUsers && (
                      <p>
                        <span className="text-slate-500 mr-2">Max Capacity:</span>{' '}
                        {event.maxOnlineUsers}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Middle & Right Column: Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {event.description || 'No description provided for this event.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Date & Time
                  </h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Start Time</p>
                      <p>
                        {event.startTime
                          ? `${new Date(event.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5 mt-2">End Time</p>
                      <p>
                        {event.endTime
                          ? `${new Date(event.endTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${new Date(event.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {(event.eventType === 'OFFLINE' || event.eventType === 'HYBRID') && (
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Location
                    </h3>
                    <div className="text-sm text-slate-300">
                      {event.location && event.location.address ? (
                        <p className="leading-relaxed">{event.location.address}</p>
                      ) : event.location && event.location.coordinates ? (
                        <div className="space-y-1">
                          <p className="text-slate-500 italic text-xs mb-1">
                            Address not provided. Coordinates:
                          </p>
                          <p>
                            <span className="text-slate-500 mr-2">Lng:</span>{' '}
                            {event.location.coordinates[0]}
                          </p>
                          <p>
                            <span className="text-slate-500 mr-2">Lat:</span>{' '}
                            {event.location.coordinates[1]}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">No location available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket Types / Offline Blocks */}
              {(event.eventType === 'OFFLINE' || event.eventType === 'HYBRID') &&
                blocks.length > 0 && (
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                      Ticket Categories & Seats
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {blocks.map((b: any, i: number) => {
                        const name =
                          b.category?.name || b.blockName || b.blocName || `Block ${i + 1}`;
                        const price = b.category?.price;
                        const totalSeats = b.rows
                          ? b.rows.reduce((sum: number, r: any) => sum + (r.seats?.length || 0), 0)
                          : 0;

                        return (
                          <div
                            key={i}
                            className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
                          >
                            <div className="font-medium text-slate-200 text-sm mb-1">{name}</div>
                            <div className="flex justify-between items-end text-xs">
                              <span className="text-slate-400">
                                {totalSeats > 0 ? `${totalSeats} seats` : 'Seats unknown'}
                              </span>
                              <span className="font-semibold text-emerald-400">
                                {typeof price === 'number' ? `₹${price}` : '—'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end items-center gap-3">
          {event.status === 'ACTIVE' && (
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {isStarting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Starting Event...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Event
                </>
              )}
            </button>
          )}
          {event.status === 'LIVE' && (
            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Event Live
            </span>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
