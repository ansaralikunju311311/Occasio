import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { bookingService } from '../../services/booking.service';
import LoadingSpinner from '../common/LoadingSpinner';

interface RefundDetails {
  eligible: boolean;
  refundPercentage: number;
  refundAmount: number;
  totalAmount: number;
  message: string;
}

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onConfirmSuccess: () => void;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  onConfirmSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundDetails, setRefundDetails] = useState<RefundDetails | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const fetchRefundDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await bookingService.getRefundInfo(bookingId);
        if (res.success) {
          setRefundDetails(res.data);
        } else {
          setError(res.message || 'Failed to fetch refund details.');
        }
      } catch (err: any) {
        console.error('Failed to load refund info:', err);
        setError(err.response?.data?.message || 'Error checking cancellation eligibility.');
      } finally {
        setLoading(false);
      }
    };

    fetchRefundDetails();
  }, [isOpen, bookingId]);

  const handleCancelConfirm = async () => {
    try {
      setCancelling(true);
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        toast.success('Booking cancelled successfully.');
        onConfirmSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Failed to cancel booking.');
      }
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast.error(err.response?.data?.message || 'An error occurred while cancelling the booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">
            Cancel <span className="text-rose-400">Booking</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            disabled={cancelling}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <LoadingSpinner />
              <p className="text-sm text-slate-400">Calculating your refund details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Error Retrieving Refund Info</h3>
              <p className="text-sm text-slate-400 mb-6">{error}</p>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : refundDetails ? (
            <div>
              {!refundDetails.eligible ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Cancellation Unavailable</h3>
                  <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 mb-6 text-center">
                    {refundDetails.message}
                  </p>
                  <p className="text-xs text-slate-500 mb-6">
                    Total booking amount paid: ₹{refundDetails.totalAmount}
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 divide-y divide-slate-800/80">
                    <div className="flex justify-between pb-3">
                      <span className="text-slate-400 text-sm">Amount Paid:</span>
                      <span className="text-white font-semibold">₹{refundDetails.totalAmount}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-slate-400 text-sm">Refund Percentage:</span>
                      <span className="text-indigo-400 font-bold">{refundDetails.refundPercentage}%</span>
                    </div>
                    <div className="flex justify-between pt-3">
                      <span className="text-slate-400 text-sm font-medium">Estimated Refund:</span>
                      <span className="text-teal-400 font-black text-lg">₹{refundDetails.refundAmount}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-300/90 text-xs">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                      Are you sure you want to cancel? This action cannot be undone. The refund of{' '}
                      <span className="font-bold text-teal-400">₹{refundDetails.refundAmount}</span> will be credited
                      to your wallet balance.
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      disabled={cancelling}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={handleCancelConfirm}
                      disabled={cancelling}
                      className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {cancelling ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Cancelling...
                        </>
                      ) : (
                        'Confirm Cancel'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
