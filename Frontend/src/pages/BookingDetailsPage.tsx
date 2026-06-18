import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { paymentService } from '../services/payment.service';
import { useAppSelector } from '../redux/hook';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'sonner';
import { APP_MESSAGES } from '../constants';

interface Booking {
  id: string;
  eventId: {
    _id: string;
    title: string;
    picture: string;
    startTime: string;
    endTime: string;
    eventType: string;
    description: string;
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

const BookingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getMyBookings();
        if (res.success) {
          const match = (res.data || []).find((b: any) => b.id === id);
          if (match) {
            setBooking(match);
          } else {
            toast.error('Ticket details not found.');
          }
        }
      } catch (err) {
        console.error('Failed to load booking details:', err);
        toast.error(APP_MESSAGES.LOAD_BOOKINGS_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner />;

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 px-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h2>
        <p className="text-slate-400 max-w-md mb-8">
          We could not load this booking ticket. It may not exist or belongs to another user.
        </p>
        <button
          onClick={() => navigate('/bookings')}
          className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl border border-slate-800 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
        >
          My Bookings
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(booking.id)}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-6">
      {/* Inject print styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .no-print {
              display: none !important;
            }
            .print-card {
              border: 2px dashed #94a3b8 !important;
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 24px !important;
              width: 100% !important;
              max-width: 600px !important;
              border-radius: 12px !important;
            }
            .print-text-dark {
              color: #0f172a !important;
            }
            .print-text-muted {
              color: #475569 !important;
            }
            .print-badge {
              border: 1px solid #cbd5e1 !important;
              background: #f1f5f9 !important;
              color: #0f172a !important;
            }
            .print-qr {
              filter: none !important;
              border: 1px solid #cbd5e1 !important;
            }
          }
        `
      }} />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Top Actions Row */}
        <div className="flex justify-between items-center mb-8 no-print">
          <button
            onClick={() => navigate('/bookings')}
            className="group px-4 py-2 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            My Bookings
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
        </div>

        {/* Ticket Outer Wrapper */}
        <div className="print-card bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col">
          
          {/* Header Info */}
          <div className="p-8 border-b border-dashed border-slate-800/80 flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-5">
              <img
                src={booking.eventId.picture || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                alt={booking.eventId.title}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-800"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="print-badge px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider">
                    {booking.eventId.eventType}
                  </span>
                  <span className="print-badge px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold uppercase tracking-wider">
                    {booking.bookingType}
                  </span>
                </div>
                <h2 className="print-text-dark text-xl md:text-2xl font-extrabold text-white leading-tight">
                  {booking.eventId.title}
                </h2>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5 self-stretch md:self-auto justify-between md:justify-start">
              <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase border tracking-widest ${
                booking.status === 'SUCCESS'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : booking.status === 'PENDING'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {booking.status}
              </span>
              <span className="print-text-muted text-[10px] text-slate-500">
                Id: {booking.id.substring(0, 12).toUpperCase()}...
              </span>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-8 grid md:grid-cols-3 gap-8 items-center border-b border-dashed border-slate-800/80">
            
            {/* Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="print-text-muted text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Attendee Name</h4>
                <p className="print-text-dark text-base font-semibold text-white">{user?.name || 'Valued Guest'}</p>
                <p className="print-text-muted text-xs text-slate-400 mt-0.5">{user?.email}</p>
              </div>

              <div>
                <h4 className="print-text-muted text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date & Time</h4>
                <p className="print-text-dark text-sm font-semibold text-slate-200">{formatDate(booking.eventId.startTime)}</p>
                <p className="print-text-muted text-xs text-indigo-400 font-medium mt-1">Please arrive 15 mins prior.</p>
              </div>

              {booking.eventId.location?.address && (
                <div>
                  <h4 className="print-text-muted text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Venue Address</h4>
                  <p className="print-text-dark text-sm text-slate-300 leading-relaxed font-light">{booking.eventId.location.address}</p>
                </div>
              )}
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-3xl border border-slate-800/60 max-w-[220px] mx-auto w-full">
              <div className="print-qr bg-white p-2.5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                <img
                  src={qrCodeUrl}
                  alt={`Booking QR Code: ${booking.id}`}
                  className="w-36 h-36 object-contain"
                />
              </div>
              <span className="print-text-muted text-[9px] text-slate-500 uppercase font-black tracking-widest mt-3">Scan to Validate</span>
            </div>
          </div>

          {/* Receipt Info Panel */}
          <div className="p-8 bg-slate-900/20 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div>
              <h4 className="print-text-muted text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Booking Type</h4>
              <p className="print-text-dark text-sm font-bold text-slate-200 capitalize">{booking.bookingType}</p>
            </div>
            <div>
              <h4 className="print-text-muted text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Seats Booked</h4>
              <p className="print-text-dark text-sm font-bold text-slate-200 truncate">
                {booking.bookingType === 'physical' && booking.seats.length > 0 ? booking.seats.join(', ') : 'N/A (Virtual)'}
              </p>
            </div>
            <div>
              <h4 className="print-text-muted text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Booked On</h4>
              <p className="print-text-dark text-sm font-bold text-slate-200">{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right md:text-left">
              <h4 className="print-text-muted text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Paid</h4>
              <p className="print-text-dark text-lg font-black text-teal-400">₹{booking.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
