import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeButton from '../../components/common/HomeButton';
import { paymentService } from '../../services/payment.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';
import { APP_MESSAGES } from '../../constants';
import { Table } from '../../components/common/Table';
import { Pagination } from '../../components/common/Pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<any>(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/eventmanager');

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getMyBookings(currentPage, itemsPerPage);
        if (res.success) {
          setBookings(res.data || []);
          setMetadata(res.metadata);
        }
      } catch (err: any) {
        console.error('Failed to fetch bookings:', err);
        toast.error(APP_MESSAGES.LOAD_BOOKINGS_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={isDashboard ? "animate-fade-in-up" : "min-h-screen bg-slate-950 pt-28 pb-16 px-6 text-slate-100 animate-fade-in-up"}>
      <div className={isDashboard ? "" : "max-w-7xl mx-auto"}>
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
        <div className="bg-[#0a0f16]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
          <Table
            tableClassName="w-full text-left border-collapse min-w-[900px]"
            theadClassName=""
            trHeadClassName="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold"
            tbodyClassName="divide-y divide-slate-800/60"
            columns={[
              { header: 'Event', className: 'px-6 py-4' },
              { header: 'Date & Time', className: 'px-6 py-4' },
              { header: 'Type / Format', className: 'px-6 py-4' },
              { header: 'Seats', className: 'px-6 py-4' },
              { header: 'Amount Paid', className: 'px-6 py-4' },
              { header: 'Status', className: 'px-6 py-4' },
              { header: 'Actions', className: 'px-6 py-4 text-right' },
            ]}
            data={bookings}
            emptyState={
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No bookings found
                </td>
              </tr>
            }
            renderRow={(booking: Booking) => (
              <tr
                key={booking.id}
                className="hover:bg-slate-800/20 transition-colors duration-150 text-slate-300 text-sm"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        booking.eventId.picture ||
                        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
                      }
                      alt={booking.eventId.title}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div
                      className="font-bold text-white max-w-[200px] truncate"
                      title={booking.eventId.title}
                    >
                      {booking.eventId.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.eventId?.startTime
                    ? new Date(booking.eventId.startTime).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider">
                        {booking.eventId.eventType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold uppercase tracking-wider">
                        {booking.bookingType}
                      </span>
                    </div>
                    {booking.eventId.location?.address && (
                      <span
                        className="text-slate-400 text-xs truncate max-w-[180px]"
                        title={booking.eventId.location.address}
                      >
                        {booking.eventId.location.address}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                  {booking.bookingType === 'physical' && booking.seats.length > 0 ? (
                    booking.seats.join(', ')
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-teal-400">
                  ₹{booking.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                      booking.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : booking.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3">
                    <div
                      onClick={() => navigate(`/booking/${booking.id}`)}
                      className="w-10 h-10 bg-white p-0.5 rounded-lg flex items-center justify-center cursor-pointer border border-slate-700/50 shadow-inner shrink-0 group/qr"
                      title="Click to view ticket QR Code"
                    >
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${booking.id}`}
                        alt="QR"
                        className="w-full h-full object-contain group-hover/qr:scale-105 transition-transform"
                      />
                    </div>
                    <button
                      onClick={() => navigate(`/booking/${booking.id}`)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold rounded-lg border border-indigo-500/20 transition-all cursor-pointer"
                    >
                      View Ticket
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
          {metadata && metadata.total > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={metadata.totalPages}
              totalItems={metadata.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  </div>


  );
};

export default UserBookings;

