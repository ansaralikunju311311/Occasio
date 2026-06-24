import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';
import CurrentLocation from '../components/user/CurrentLocation';
import { useEvents } from '../hooks/useEvents';

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: responseData,
    isLoading: loading,
    error,
  } = useEvents({
    page: 1,
    limit: 3,
  });

  const events = responseData?.events || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getMinSeatPrice = (event: any): number | null => {
    const blocks =
      event?.SeatLayout?.blocks ??
      event?.seatLayout?.blocks ??
      event?.seatLayoutDetails?.blocks ??
      event?.layout?.blocks ??
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
  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-6 shadow-sm border border-indigo-500/20">
            {user
              ? `Welcome Back to Occasio - ${user.email}   ${user.id}`
              : 'The New Standard for Events'}
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8 text-white">
            {user ? (
              <>
                Hello,{' '}
                <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  {user.name}
                </span>
                ! <br />
                Ready for your next event?
              </>
            ) : (
              <>
                Discover & Book <br />
                <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Amazing Events
                </span>
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {user
              ? 'Browse through the latest events, manage your bookings, and never miss a moment of excitement.'
              : 'Occasio makes event booking seamless with real-time seat selection, secure payments, and instant confirmations.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            {user ? (
              <>
                <button
                  onClick={() =>
                    navigate(
                      user.role === 'ADMIN'
                        ? '/admin/dashboard'
                        : user.role === 'EVENT_MANAGER'
                          ? '/eventmanager'
                          : '/events'
                    )
                  }
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-[0_0_40px_-5px_rgb(99,102,241,0.4)] hover:shadow-[0_0_60px_-10px_rgb(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 border border-white/10"
                >
                  {user.role === 'USER' ? 'Explore Events' : 'Go to Dashboard'}
                </button>
                {user.role === 'USER' ? (
                  <button
                    onClick={() => navigate('/bookings')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                  >
                    My Bookings
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                  >
                    View Site
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-[0_0_40px_-5px_rgb(99,102,241,0.4)] hover:shadow-[0_0_60px_-10px_rgb(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 border border-white/10"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <CurrentLocation />
        </div>
      </section>
      {/* FEATURES SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Why Choose Occasio?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need for the perfect event experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-indigo-500/30 hover:shadow-[0_0_40px_-10px_rgb(99,102,241,0.15)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:bg-indigo-500 group-hover:border-transparent transition-all duration-300">
              <svg
                className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Real-Time Seat Booking
            </h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Select your exact seat with dynamic layouts and live availability updates ensuring no
              double bookings.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-purple-500/30 hover:shadow-[0_0_40px_-10px_rgb(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:bg-purple-500 group-hover:border-transparent transition-all duration-300">
              <svg
                className="w-7 h-7 text-purple-400 group-hover:text-white transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Secure Payments</h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Stripe-powered secure transactions with instant booking confirmation and encrypted
              data processing.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-pink-500/30 hover:shadow-[0_0_40px_-10px_rgb(236,72,153,0.15)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-8 group-hover:bg-pink-500 group-hover:border-transparent transition-all duration-300">
              <svg
                className="w-7 h-7 text-pink-400 group-hover:text-white transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Event Management</h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Powerful dashboard for managers to create events, track analytics, and handle
              attendees effortlessly.
            </p>
          </div>
        </div>
      </section>
      {/* EVENTS SECTION */}
      <section id="events-section" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 text-center md:text-left">
              Upcoming{' '}
              <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl text-center md:text-left font-light">
              Discover local and international events across online, offline, and hybrid formats.
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-300 border border-indigo-500 shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              Explore All Events
            </button>
          </div>
        </div>
        {error && (
          <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-2xl mb-12">
            <p className="text-red-400 font-light">
              {error instanceof Error ? error.message : String(error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-indigo-400 text-sm mt-2 hover:underline"
            >
              Try Again
            </button>
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 animate-pulse font-light">
              Fetching amazing experiences...
            </p>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: any) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2rem] overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.2)] transition-all duration-500 flex flex-col h-full cursor-pointer"
                >
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={
                        event.picture ||
                        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop'
                      }
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                        {event.eventType}
                      </span>
                    </div>
                    {(() => {
                      const type = event.eventType?.toUpperCase();
                      const minSeatPrice = getMinSeatPrice(event);
                      const onlinePrice = Number(event.price) || 0;

                      let isFree = false;
                      if (type === 'ONLINE') isFree = onlinePrice === 0;
                      else if (type === 'OFFLINE')
                        isFree = (minSeatPrice === null || minSeatPrice === 0) && onlinePrice === 0;
                      else if (type === 'HYBRID')
                        isFree = onlinePrice === 0 && (minSeatPrice === null || minSeatPrice === 0);
                      else isFree = onlinePrice === 0;

                      return (
                        isFree && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                              Free
                            </span>
                          </div>
                        )
                      );
                    })()}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold mb-4 uppercase tracking-[0.2em] break-words">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {formatDate(event.startTime)}{' '}
                        {event.endTime && ` - ${formatDate(event.endTime)}`}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors tracking-tight">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-8 font-light leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/60">
                      <div className="text-white font-bold text-sm">
                        {(() => {
                          const type = event.eventType?.toUpperCase();
                          const minSeatPrice = getMinSeatPrice(event);
                          const onlinePrice = event.price;

                          if (type === 'ONLINE') {
                            return onlinePrice > 0 ? (
                              <span>₹{onlinePrice}</span>
                            ) : (
                              <span className="text-emerald-400">Free</span>
                            );
                          }

                          if (type === 'OFFLINE') {
                            if (minSeatPrice !== null) {
                              return (
                                <span className="text-slate-300">
                                  Starts from{' '}
                                  <span className="text-white text-lg">₹{minSeatPrice}</span>
                                </span>
                              );
                            }
                            return onlinePrice > 0 ? (
                              <span>₹{onlinePrice}</span>
                            ) : (
                              <span className="text-emerald-400">Free</span>
                            );
                          }

                          if (type === 'HYBRID') {
                            return (
                              <div className="flex flex-col gap-0.5">
                                {minSeatPrice !== null && (
                                  <span className="text-slate-300 text-xs">
                                    Venue:{' '}
                                    <span className="text-white font-bold">₹{minSeatPrice}+</span>
                                  </span>
                                )}
                                {onlinePrice > 0 && (
                                  <span className="text-slate-300 text-xs">
                                    Online:{' '}
                                    <span className="text-indigo-400 font-bold">
                                      ₹{onlinePrice}
                                    </span>
                                  </span>
                                )}
                                {!minSeatPrice && !onlinePrice && (
                                  <span className="text-emerald-400">Free</span>
                                )}
                              </div>
                            );
                          }

                          // Fallback
                          return onlinePrice > 0 ? (
                            <span>₹{onlinePrice}</span>
                          ) : (
                            <span className="text-emerald-400">Free</span>
                          );
                        })()}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/${event.id}`);
                        }}
                        className="text-indigo-400 hover:text-white text-sm font-semibold flex items-center transition-colors group/btn"
                      >
                        View Details
                        <svg
                          className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 rounded-xl bg-slate-900/50 text-white font-semibold text-lg border border-slate-800 hover:border-slate-600 hover:bg-slate-900 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-md"
              >
                View More Events
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-slate-900/20 backdrop-blur-sm border border-slate-800/40 rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-700 shadow-inner">
              <svg
                className="w-10 h-10 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
              No Upcoming Events
            </h3>
            <p className="text-slate-400 max-w-md mx-auto font-light">
              Check back later for new and exciting experiences coming your way.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
