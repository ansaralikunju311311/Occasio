import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { EventType } from './eventManager/CreateEvent';
import { Pagination } from '../components/common/Pagination';
import { SearchBar } from '../components/common/SearchBar';
import { toast } from 'sonner';
import { APP_MESSAGES } from '../constants';

const EventsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Advanced Geolocation & Sorting state
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(100); // 100km default
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sortBy, setSortBy] = useState('DATE_ASC'); // DATE_ASC, DATE_DESC, PRICE_ASC, PRICE_DESC, TITLE_ASC, DISTANCE_ASC

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchValue);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const {
    data: responseData,
    isLoading: loading,
    error,
  } = useEvents({
    eventType: eventFilter && eventFilter.toUpperCase() !== 'ALL' ? eventFilter : undefined,
    search: searchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  const events = responseData?.events || [];
  const metadata = responseData?.metadata;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (eventType: string) => {
    setEventFilter(eventType);
    setCurrentPage(1);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error(APP_MESSAGES.LOCATION_NOT_SUPPORTED);
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationStatus('success');
        toast.success('Location detected successfully!');
      },
      (err) => {
        console.error('Error getting location:', err);
        toast.error(APP_MESSAGES.LOCATION_DENIED);
        setLocationStatus('error');
        setNearbyOnly(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleNearbyToggle = (checked: boolean) => {
    if (checked && !userCoords) {
      requestLocation();
    }
    setNearbyOnly(checked);
    if (!checked && sortBy === 'DISTANCE_ASC') {
      setSortBy('DATE_ASC');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

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

  // Map events to include calculated distance if coordinates exist
  const processedEvents = events.map((event: any) => {
    let distance: number | null = null;
    if (
      userCoords &&
      event.location &&
      event.location.coordinates &&
      event.location.coordinates.length === 2
    ) {
      const lng = event.location.coordinates[0];
      const lat = event.location.coordinates[1];
      distance = calculateDistance(userCoords.latitude, userCoords.longitude, lat, lng);
    }
    return { ...event, distance };
  });

  // Filter based on "Nearby Only"
  const filteredEvents = processedEvents.filter((event: any) => {
    if (nearbyOnly && userCoords) {
      if (event.eventType?.toUpperCase() === 'ONLINE') return false; // Online has no physical proximity
      if (event.distance === null) return false;
      return event.distance <= nearbyRadius;
    }
    return true;
  });

  // Sort events list
  const sortedEvents = [...filteredEvents].sort((a: any, b: any) => {
    if (sortBy === 'DATE_ASC') {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    if (sortBy === 'DATE_DESC') {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    }
    if (sortBy === 'TITLE_ASC') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'PRICE_ASC') {
      const priceA = a.eventType?.toUpperCase() === 'ONLINE' ? Number(a.price) || 0 : getMinSeatPrice(a) || Number(a.price) || 0;
      const priceB = b.eventType?.toUpperCase() === 'ONLINE' ? Number(b.price) || 0 : getMinSeatPrice(b) || Number(b.price) || 0;
      return priceA - priceB;
    }
    if (sortBy === 'PRICE_DESC') {
      const priceA = a.eventType?.toUpperCase() === 'ONLINE' ? Number(a.price) || 0 : getMinSeatPrice(a) || Number(a.price) || 0;
      const priceB = b.eventType?.toUpperCase() === 'ONLINE' ? Number(b.price) || 0 : getMinSeatPrice(b) || Number(b.price) || 0;
      return priceB - priceA;
    }
    if (sortBy === 'DISTANCE_ASC' && userCoords) {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Explore{' '}
              <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl font-light">
              Search and filter through all live, virtual, and hybrid event experiences.
            </p>
          </div>
        </div>

        {/* Toolbar Panel (Search, Filter, Geolocation & Sorting) */}
        <div className="flex flex-col gap-6 bg-slate-900/30 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 mb-10">
          {/* Row 1: Search and Event Type Tabs */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-80">
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by title or description..."
                className="relative w-full"
                inputClassName="block w-full pl-10 pr-4 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
                iconClassName="h-5 w-5 text-slate-500"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {['ALL', EventType.ONLINE, EventType.OFFLINE, EventType.HYBRID].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                    eventFilter === type
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Sort dropdown and Geolocation Controls */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-4 border-t border-slate-800/40">
            {/* Sort Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
              >
                <option value="DATE_ASC">Soonest First</option>
                <option value="DATE_DESC">Latest First</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="TITLE_ASC">Title: A-Z</option>
                {userCoords && <option value="DISTANCE_ASC">Distance: Nearest First</option>}
              </select>
            </div>

            {/* Geolocation Controls */}
            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (userCoords) {
                      setUserCoords(null);
                      setNearbyOnly(false);
                      setLocationStatus('idle');
                      toast.info('Location cleared');
                    } else {
                      requestLocation();
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                    userCoords
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${userCoords ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                  {locationStatus === 'loading' ? 'Detecting...' : userCoords ? 'Location Detected' : 'Detect Location'}
                </button>

                {userCoords && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={nearbyOnly}
                      onChange={(e) => handleNearbyToggle(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500 cursor-pointer"
                    />
                    Nearby Events Only
                  </label>
                )}
              </div>

              {nearbyOnly && userCoords && (
                <div className="flex items-center gap-3 w-full sm:w-64">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Radius: {nearbyRadius} km</span>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={nearbyRadius}
                    onChange={(e) => setNearbyRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-2xl mb-12">
            <p className="text-red-400 font-light">
              {error instanceof Error ? error.message : String(error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-indigo-400 text-sm mt-2 hover:underline font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading / Cards rendering logic */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 animate-pulse font-light">
              Fetching amazing experiences...
            </p>
          </div>
        ) : sortedEvents.length > 0 ? (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event: any) => (
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Event Type Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                        {event.eventType}
                      </span>
                    </div>

                    {/* Geolocation Distance Badge */}
                    {event.distance !== null && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                          <span>📍</span>
                          <span>{event.distance.toFixed(1)} km away</span>
                        </span>
                      </div>
                    )}

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
                                    <span className="text-indigo-400 font-bold">₹{onlinePrice}</span>
                                  </span>
                                )}
                                {!minSeatPrice && !onlinePrice && (
                                  <span className="text-emerald-400">Free</span>
                                )}
                              </div>
                            );
                          }

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

            {/* Pagination Section */}
            {metadata && metadata.total > 0 && !nearbyOnly && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={metadata.totalPages}
                  totalItems={metadata.total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
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
              No Events Found
            </h3>
            <p className="text-slate-400 max-w-md mx-auto font-light">
              Try adjusting your search query, sorting, or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
