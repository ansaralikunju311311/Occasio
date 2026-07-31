import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/common/HomeButton';
import { toast } from 'sonner';
import { paymentService } from '../../services/payment.service';
import { Table } from '../../components/common/Table';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import EventDetailsModal from '../../components/admin/EventDetailsModal';
import { useMyEvents, useDeleteEvent, useStartEvent } from '../../hooks/useEvents';

const EventManagerMyEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate();
  const deleteMutation = useDeleteEvent();
  const startMutation = useStartEvent();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSchedulingId, setIsSchedulingId] = useState<string | null>(null);
  const [isStartingId, setIsStartingId] = useState<string | null>(null);
  const [eventToCancel, setEventToCancel] = useState<any>(null);

  const handleStartEvent = async (id: string) => {
    setIsStartingId(id);
    try {
      await startMutation.mutateAsync(id);
      toast.success('Event is now LIVE!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to start event.');
    } finally {
      setIsStartingId(null);
    }
  };

  const {
    data: responseData,
    isLoading: loading,
    error,
  } = useMyEvents({
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });

  const events = responseData?.events || [];
  const metadata = responseData?.metadata;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (id: string) => {
    navigate(`/eventmanager/edit-event/${id}`);
  };

  const handleCancelConfirm = async () => {
    if (!eventToCancel) return;
    const id = eventToCancel.id;
    setIsDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Event cancelled successfully.');
      setEventToCancel(null);
    } catch (err) {
      toast.error('Failed to cancel event.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleScheduleClick = async (event: any) => {
    setIsSchedulingId(event.id);
    try {
      const orderResponse = await paymentService.createOrder(event.id);
      paymentService.openRazorpayCheckout(
        orderResponse.order,
        event.id,
        () => {
          toast.success('Payment successful! Event is now scheduled & ACTIVE.');
          setIsSchedulingId(null);
          window.location.reload();
        },
        (err: any) => {
          toast.error(err.message || 'Payment failed');
          setIsSchedulingId(null);
        }
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setIsSchedulingId(null);
    }
  };

  if (error) {
    toast.error('Failed to load your events.');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh] bg-[#070b14]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const filteredEvents = events.filter((event: any) => {
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
    return matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'UPCOMING':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'ENDED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'DRAFT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getFormatStyle = (format: string) => {
    switch (format) {
      case 'ONLINE':
        return 'text-sky-400 bg-sky-400/10';
      case 'OFFLINE':
        return 'text-amber-400 bg-amber-400/10';
      case 'HYBRID':
        return 'text-purple-400 bg-purple-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="p-8 w-full min-h-screen bg-[#070b14]">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
              <svg
                className="w-5 h-5 text-teal-400"
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
            </div>
            My Events
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Manage your hosted events, track ticket sales, and view analytics.
          </p>
          <div className="mt-4">
            <HomeButton />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-white text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-not-allowed opacity-50">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Export Data
          </button>
          <button
            onClick={() => navigate('/eventmanager/create-event')}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Event
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0a0f16]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        <SearchBar
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search your events..."
        />

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-full md:w-auto">
          {['ALL', 'ACTIVE', 'LIVE', 'DRAFT', 'ENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === status
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-[#0a0f16]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <Table
            tableClassName="w-full text-left border-collapse min-w-[800px]"
            theadClassName=""
            trHeadClassName="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold"
            tbodyClassName="divide-y divide-slate-800/60"
            columns={[
              { header: 'Event Info', className: 'px-6 py-4' },
              { header: 'Date & Format', className: 'px-6 py-4' },
              { header: 'Ticket Price', className: 'px-6 py-4' },
              { header: 'Status', className: 'px-6 py-4' },
              { header: 'Actions', className: 'px-6 py-4 text-right' },
            ]}
            data={filteredEvents}
            emptyState={
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-10 h-10 mb-3 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No events found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            }
            renderRow={(event: any) => {
              const isStarted = new Date(event.startTime) <= new Date();
              const isCancelled = event.isDeleted;
              return (
                <tr
                  key={event.id}
                  className={`transition-colors group ${
                    isCancelled
                      ? 'bg-rose-950/5 hover:bg-rose-950/10 opacity-70'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <td className="px-6 py-4 flex flex-col justify-center">
                    <div className="text-white font-semibold text-sm truncate max-w-50 mb-1 group-hover:text-teal-400 transition-colors">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-mono" title={event.id}>
                        {event.id ? `${event.id.substring(0, 8)}...` : 'N/A'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="text-slate-400 capitalize">
                        {event.eventType?.toLowerCase() || 'Event'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300 mb-2 flex items-start gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0"
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
                      <div className="flex flex-col">
                        <span>
                          {event.startTime
                            ? `${new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                            : 'N/A'}
                        </span>
                        {event.endTime && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            to{' '}
                            {new Date(event.endTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            at{' '}
                            {new Date(event.endTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${getFormatStyle(event.eventType)}`}
                    >
                      {event.eventType || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const type = event.eventType?.toUpperCase();
                      const blocks =
                        event?.SeatLayout?.blocks ??
                        event?.seatLayout?.blocks ??
                        event?.seatLayoutId?.blocks ??
                        event?.seatLayoutDetails?.blocks ??
                        event?.layout?.blocks ??
                        [];
                      const onlinePrice = event.price ?? 0;

                      if (type === 'ONLINE') {
                        return (
                          <div className="text-sm font-medium text-emerald-400">
                            {onlinePrice > 0 ? `₹${onlinePrice}` : 'Free'}
                          </div>
                        );
                      }

                      if (type === 'OFFLINE') {
                        if (blocks.length > 0) {
                          return (
                            <div className="flex flex-col gap-1">
                              {blocks.map((b: any, i: number) => {
                                const name =
                                  b.category?.name || b.blockName || b.blocName || `Block ${i + 1}`;
                                const price = b.category?.price;
                                return (
                                  <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-400">{name}:</span>
                                    <span className="font-semibold text-emerald-400">
                                      {typeof price === 'number' ? `₹${price}` : '—'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return (
                          <div className="text-sm font-medium text-emerald-400">
                            {onlinePrice > 0 ? `₹${onlinePrice}` : 'Free'}
                          </div>
                        );
                      }

                      if (type === 'HYBRID') {
                        return (
                          <div className="flex flex-col gap-1.5">
                            {/* Online ticket */}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-400 font-bold text-[9px] uppercase">
                                Online
                              </span>
                              <span className="font-semibold text-emerald-400">
                                {onlinePrice > 0 ? `₹${onlinePrice}` : 'Free'}
                              </span>
                            </div>
                            {/* Offline categories */}
                            {blocks.length > 0 && (
                              <div className="flex flex-col gap-1 pt-1 border-t border-slate-800/50">
                                {blocks.map((b: any, i: number) => {
                                  const name =
                                    b.category?.name ||
                                    b.blockName ||
                                    b.blocName ||
                                    `Block ${i + 1}`;
                                  const price = b.category?.price;
                                  return (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                      <span className="text-slate-500">{name}:</span>
                                      <span className="font-semibold text-amber-400">
                                        {typeof price === 'number' ? `₹${price}` : '—'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Fallback
                      return (
                        <div className="text-sm font-medium text-emerald-400">
                          {onlinePrice > 0 ? `₹${onlinePrice}` : 'Free'}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        isCancelled ? getStatusStyle('CANCELLED') : getStatusStyle(event.status)
                      }`}
                    >
                      {isCancelled ? 'CANCELLED' : event.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    {isCancelled ? (
                      <span className="text-xs font-bold text-rose-500/60 uppercase tracking-widest py-2 px-3">
                        Event Cancelled
                      </span>
                    ) : (
                      <>
                        {event.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleStartEvent(event.id)}
                            disabled={isStartingId === event.id}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                            title="Start event to make it LIVE"
                          >
                            {isStartingId === event.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Starting...
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Event
                              </>
                            )}
                          </button>
                        )}
                        {event.status === 'LIVE' && (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase rounded-lg inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Event Live
                          </span>
                        )}
                        {event.status === 'DRAFT' && (
                          <button
                            onClick={() => {
                              handleScheduleClick(event);
                            }}
                            disabled={isSchedulingId === event.id}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg transition-all inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Complete payment to publish"
                          >
                            {isSchedulingId === event.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Scheduling...
                              </>
                            ) : (
                              'Schedule'
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors inline-block"
                          title="View details"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleEdit(event.id)}
                          disabled={isStarted}
                          className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-700/50 rounded-lg transition-colors inline-block disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title={
                            isStarted ? 'Cannot edit event after it has started' : 'Edit event'
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => setEventToCancel(event)}
                          disabled={isStarted || isDeletingId === event.id}
                          className="p-2 text-rose-400 hover:text-white hover:bg-rose-700/50 rounded-lg transition-colors inline-block disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title={
                            isStarted
                              ? 'Cannot cancel event after it has started'
                              : 'Cancel (Delete) event'
                          }
                        >
                          {isDeletingId === event.id ? (
                            <div className="w-4 h-4 border-2 border-rose-400/20 border-t-rose-400 rounded-full animate-spin" />
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            }}
          />

          {/* Pagination Section */}
          {metadata && metadata.total > 0 && (
            <div className="border-t border-slate-800/60">
              <Pagination
                currentPage={currentPage}
                totalPages={metadata.totalPages}
                totalItems={metadata.total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* Cancel Event Confirmation Modal */}
      {eventToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div
            className="absolute inset-0"
            onClick={() => !isDeletingId && setEventToCancel(null)}
          ></div>
          <div className="relative bg-[#0a0f16] border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
            {/* Header / Icon */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-500 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cancel Event</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {eventToCancel.id}</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-6">
              <p className="text-slate-300 text-sm leading-relaxed">
                Are you sure you want to cancel (delete) the event <span className="text-white font-semibold">"{eventToCancel.title}"</span>?
              </p>
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-rose-400 text-xs flex gap-2 leading-relaxed">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  This action cannot be undone. All active bookings and sessions for this event will be canceled.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setEventToCancel(null)}
                disabled={isDeletingId === eventToCancel.id}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors border border-slate-700"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isDeletingId === eventToCancel.id}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              >
                {isDeletingId === eventToCancel.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagerMyEvents;
