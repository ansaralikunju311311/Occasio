import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/common/HomeButton';
import { paymentService } from '../../services/payment.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';
import { APP_MESSAGES } from '../../constants';

interface Booking {
  id: string;
  eventId: {
    _id: string;
    title: string;
    picture: string;
    startTime: string;
    endTime: string;
    eventType: string;
    location?: {
      address: string;
    };
  };
  seats: string[];
  bookingType: 'physical' | 'online';
  totalAmount: number;
  status: string;
  createdAt: string;
}

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getMyBookings();
        if (res.success) {
          setBookings(res.data || []);
        }
      } catch (err: any) {
        console.error('Failed to fetch bookings:', err);
        toast.error(APP_MESSAGES.LOAD_BOOKINGS_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          My <span className="text-purple-400">Bookings</span>
        </h1>
        <p className="text-slate-400 mt-2">
          View and manage all your event registrations and tickets.
        </p>
        <div className="mt-4">
          <HomeButton />
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-12 shadow-xl min-h-80 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
            <svg
              className="w-10 h-10 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
          <p className="text-slate-400 max-w-sm">
            You haven't booked any events yet. Explore upcoming events to get started.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex gap-4 mb-4">
                  <img
                    src={booking.eventId.picture || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                    alt={booking.eventId.title}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg leading-snug line-clamp-1">
                      {booking.eventId.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      {booking.eventId?.startTime ? new Date(booking.eventId.startTime).toLocaleString() : 'N/A'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider">
                        {booking.eventId.eventType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold uppercase tracking-wider">
                        {booking.bookingType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 py-4 border-t border-b border-slate-800/50 flex justify-between items-center">
                  <div className="space-y-2 flex-grow">
                    {booking.bookingType === 'physical' && booking.seats.length > 0 && (
                      <div className="flex justify-between items-center text-xs pr-4">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">Seats</span>
                        <span className="text-white font-bold">{booking.seats.join(', ')}</span>
                      </div>
                    )}
                    {booking.eventId.location?.address && (
                      <div className="flex justify-between items-start text-xs pr-4 gap-4">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">Venue</span>
                        <span className="text-slate-300 font-medium text-right line-clamp-1">{booking.eventId.location.address}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs pr-4">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">Amount Paid</span>
                      <span className="text-teal-400 font-bold text-sm">₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  {/* QR Code thumbnail preview */}
                  <div
                    onClick={() => navigate(`/booking/${booking.id}`)}
                    className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center cursor-pointer border border-slate-700/50 shadow-inner shrink-0 group/qr"
                    title="Click to view ticket QR Code"
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${booking.id}`}
                      alt="QR"
                      className="w-full h-full object-contain group-hover/qr:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Booked on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                </span>
                
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                      booking.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : booking.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {booking.status}
                  </span>

                  <button
                    onClick={() => navigate(`/booking/${booking.id}`)}
                    className="px-4 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold rounded-lg border border-indigo-500/20 transition-all cursor-pointer"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
