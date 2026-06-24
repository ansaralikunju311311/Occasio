import { useState, useEffect } from 'react';
import { Table } from '../../components/common/Table';
import { Pagination } from '../../components/common/Pagination';
import { paymentService } from '../../services/payment.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { APP_MESSAGES } from '../../constants';

interface Booking {
  id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  eventId?: {
    _id: string;
    title: string;
    picture?: string;
    description?: string;
    startTime?: string;
    eventType?: string;
    location?: {
      address?: string;
    };
  };
  seats: string[];
  bookingType: string;
  totalAmount: number;
  commissionAmount: number;
  organizerRevenue: number;
  status: string;
  paymentId?: string;
  createdAt: string;
}

const EventManagerBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchBookings = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await paymentService.getManagerBookings(page, itemsPerPage);
      if (res.success) {
        setBookings(res.data || []);
        setMetadata(res.metadata);
      } else {
        setError(res.message || APP_MESSAGES.LOAD_BOOKINGS_FAILED);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || APP_MESSAGES.LOAD_BOOKINGS_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Event Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all bookings and revenue details for your hosted events.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={[
            { header: 'Event' },
            { header: 'User' },
            { header: 'Seats' },
            { header: 'Revenue' },
            { header: 'Status' },
            { header: 'Date' },
          ]}
          data={bookings}
          emptyState={
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-base font-medium text-gray-900">No bookings found</p>
                  <p className="text-sm mt-1">Your events haven't received any bookings yet.</p>
                </div>
              </td>
            </tr>
          }
          renderRow={(booking: Booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.eventId?.title || 'Unknown Event'}
                </div>
                <div className="text-xs text-gray-500 mt-1 capitalize">
                  Type: {booking.bookingType}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.userId?.name || 'Unknown'}
                </div>
                <div className="text-sm text-gray-500">{booking.userId?.email || ''}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {booking.seats?.length ? booking.seats.join(', ') : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  ₹{booking.organizerRevenue?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  Total: ₹{booking.totalAmount?.toLocaleString() || 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                >
                  View Details
                </button>
              </td>
            </tr>
          )}
        />

        {/* Pagination Section */}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-slate-800">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
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

            <div className="p-6 space-y-8">
              {/* Event Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Event Information
                </h3>
                <div className="flex gap-4">
                  {selectedBooking.eventId?.picture && (
                    <img
                      src={selectedBooking.eventId.picture}
                      alt={selectedBooking.eventId.title}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">
                      {selectedBooking.eventId?.title || 'Unknown Event'}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 capitalize">
                      {selectedBooking.eventId?.eventType} Event
                    </p>
                    {selectedBooking.eventId?.startTime && (
                      <p className="font-medium text-slate-600">
                        {selectedBooking.eventId?.startTime
                          ? new Date(selectedBooking.eventId.startTime).toLocaleString()
                          : 'N/A'}
                      </p>
                    )}
                    {selectedBooking.eventId?.location?.address && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {selectedBooking.eventId.location.address}
                      </p>
                    )}
                  </div>
                </div>
                {selectedBooking.eventId?.description && (
                  <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedBooking.eventId.description}
                  </p>
                )}
              </div>

              {/* User Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Attendee Information
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Name</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedBooking.userId?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <p className="text-sm font-semibold text-slate-800 break-all">
                        {selectedBooking.userId?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Data Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Booking Transaction
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(selectedBooking.status)}`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Booking Type</p>
                      <p className="text-sm font-semibold text-slate-800 capitalize">
                        {selectedBooking.bookingType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Seats Booked</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedBooking.seats?.length
                          ? selectedBooking.seats.join(', ')
                          : 'Virtual / None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                      <p className="text-xs font-mono text-slate-800 bg-white px-2 py-1 rounded inline-block border border-slate-200">
                        {selectedBooking.paymentId || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-2">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">Total Paid by User</span>
                      <span className="font-semibold text-slate-800">
                        ₹{selectedBooking.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">Platform Commission</span>
                      <span className="text-red-500">
                        -₹{selectedBooking.commissionAmount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-800">Your Net Revenue</span>
                      <span className="font-black text-teal-600">
                        ₹{selectedBooking.organizerRevenue || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagerBookings;
