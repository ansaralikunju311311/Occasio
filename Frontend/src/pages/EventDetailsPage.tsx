import { useParams, useNavigate } from 'react-router-dom';
import { useEventDetails } from '../hooks/useEvents';
import EventMap from '../components/eventManager/EventMap';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEventDetails(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 animate-pulse font-light">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 px-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-slate-400 max-w-md mb-8">
          We couldn't retrieve the details for this event. It may have been removed or doesn't exist.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl border border-slate-800 hover:bg-slate-800 transition-all duration-300"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getMinSeatPrice = (evt: any): number | null => {
    const blocks =
      evt?.SeatLayout?.blocks ??
      evt?.seatLayout?.blocks ??
      evt?.seatLayoutDetails?.blocks ??
      evt?.layout?.blocks ??
      [];
    if (!blocks.length) return null;
    const prices = blocks
      .map((b: any) => {
        const price = b.category?.price ?? b.price;
        return Number(price);
      })
      .filter((p: number) => !isNaN(p) && p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const openInMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const type = event.eventType?.toUpperCase();
  const minSeatPrice = getMinSeatPrice(event);
  const onlinePrice = Number(event.price) || 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="group mb-8 px-4 py-2 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-10 bg-slate-900/20 backdrop-blur-xl border border-slate-800/60 rounded-[2.5rem] overflow-hidden p-8 md:p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)]">
          
          {/* Image & Map Column (Left) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="aspect-video w-full rounded-2xl overflow-hidden relative border border-slate-800">
              <img
                src={
                  event.picture ||
                  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop'
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-md text-xs font-bold text-indigo-400 border border-indigo-500/30 uppercase tracking-[0.2em]">
                  {event.eventType}
                </span>
              </div>
            </div>

            {/* Map Integration */}
            {event.location && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Venue Location</h4>
                    <p className="text-sm font-medium text-slate-300">{event.location.address}</p>
                  </div>
                </div>

                {(() => {
                  const lng = event.location.coordinates[0];
                  const lat = event.location.coordinates[1];
                  return (
                    <>
                      <div className="rounded-2xl overflow-hidden border border-slate-800/80 h-[220px] relative shadow-inner">
                        <EventMap lat={lat} lng={lng} locationName={event.location.address} />
                      </div>
                      <button
                        onClick={() => openInMaps(lat, lng)}
                        className="py-3 bg-slate-900/60 hover:bg-slate-900 text-indigo-400 text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 group/mapbtn cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4 group-hover/mapbtn:scale-110 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open in Google Maps
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Details Content Column (Right) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Event Time */}
              <div className="flex items-center gap-2.5 text-indigo-400 text-xs font-bold uppercase tracking-[0.25em] break-words">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(event.startTime)}</span>
              </div>

              {/* Event Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {event.title}
              </h1>

              {/* Event Description */}
              <div className="border-t border-slate-800/80 pt-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">About The Event</h4>
                <p className="text-slate-300 text-base font-light leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-6 border-t border-slate-800/80 pt-6">
                
                {/* Pricing Details */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing</h4>
                  <div className="text-2xl font-bold text-white">
                    {(() => {
                      if (type === 'ONLINE') {
                        return onlinePrice > 0 ? `₹${onlinePrice}` : <span className="text-emerald-400">FREE</span>;
                      }

                      if (type === 'OFFLINE') {
                        if (minSeatPrice !== null && minSeatPrice > 0) {
                          return `₹${minSeatPrice}`;
                        }
                        return onlinePrice > 0 ? `₹${onlinePrice}` : <span className="text-emerald-400">FREE</span>;
                      }

                      if (type === 'HYBRID') {
                        return (
                          <div className="flex flex-col gap-1 text-sm font-semibold">
                            {minSeatPrice !== null && minSeatPrice > 0 && (
                              <span className="text-slate-300">
                                Venue: <span className="text-white text-lg font-bold">₹{minSeatPrice}</span>
                              </span>
                            )}
                            {onlinePrice > 0 && (
                              <span className="text-slate-300">
                                Online: <span className="text-indigo-400 text-lg font-bold">₹{onlinePrice}</span>
                              </span>
                            )}
                            {!(minSeatPrice && minSeatPrice > 0) && !onlinePrice && (
                              <span className="text-emerald-400 text-xl font-bold">FREE</span>
                            )}
                          </div>
                        );
                      }

                      return onlinePrice > 0 ? `₹${onlinePrice}` : <span className="text-emerald-400">FREE</span>;
                    })()}
                  </div>
                </div>

                {/* Slots Details */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attendance</h4>
                  <p className="text-lg font-medium text-slate-200">
                    {(() => {
                      if (event.eventType === 'ONLINE') return `${event.maxOnlineUsers} Online Slots`;
                      if (event.eventType === 'HYBRID') return 'In-Person & Online';
                      return 'In-Person Venue';
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking CTAs */}
            <div className="mt-10 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/seat-selection/${event.id}`)}
                className="flex-1 py-4 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer text-center"
              >
                Book This Experience
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
