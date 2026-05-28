import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';
import HomeButton from '../../components/common/HomeButton';
import { useEventDetails } from '../../hooks/useEvents';
import { paymentService } from '../../services/payment.service';
import { bookingService } from '../../services/booking.service';

interface PriceBreakdown {
  commissionPercentage: number;
  commissionAmount: number;
  organizerRevenue: number;
  planName: string;
}

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaying, setIsPaying] = useState(false);
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { selectedSeats = [], bookingType = 'physical', lockExpiresAt } = location.state || {};
  const { data: event, isLoading: loading, isError } = useEventDetails(id);

  const isOnline = event?.eventType === 'ONLINE' || bookingType === 'online';

  let total = 0;
  if (event) {
    if (isOnline) {
      total = event.price || 0;
    } else {
      total = location.state?.totalPrice || 0;
    }
  }

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load event details');
      navigate('/');
    }
  }, [isError, navigate]);

  useEffect(() => {
    const fetchBreakdown = async () => {
      if (!id || total <= 0) return;
      try {
        setLoadingBreakdown(true);
        const res = await paymentService.getPriceBreakdown(id, total);
        if (res.success) {
          setBreakdown(res.breakdown);
        }
      } catch (err) {
        console.error('Failed to load pricing breakdown:', err);
      } finally {
        setLoadingBreakdown(false);
      }
    };

    if (id && total > 0) {
      fetchBreakdown();
    }
  }, [id, total]);

  useEffect(() => {
    if (!lockExpiresAt || isOnline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = lockExpiresAt - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        toast.error('Session expired. Seats have been released.');
        bookingService.failBooking(selectedSeats).finally(() => {
          navigate(-1);
        });
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiresAt, isOnline, navigate, selectedSeats]);

  const handleCancel = async () => {
    if (!isOnline && selectedSeats.length > 0) {
      try {
        await bookingService.failBooking(selectedSeats);
      } catch (err) {
        console.error('Failed to release seats', err);
      }
    }
    navigate(-1);
  };

  if (loading || (total > 0 && loadingBreakdown)) return <LoadingSpinner />;
  if (!event) return null;

  const handlePayment = async () => {
    if (!event || !id) return;

    setIsPaying(true);
    try {
      const amountToPay = total;
      if (!amountToPay || amountToPay <= 0) {
        toast.error('Invalid amount for payment');
        setIsPaying(false);
        return;
      }

      // 1. Create Ticket Order (Backend handles Pending Booking + Razorpay Order)
      const orderResponse = await paymentService.createTicketOrder(
        id,
        amountToPay,
        selectedSeats,
        bookingType
      );

      // 2. Open Razorpay Checkout
      paymentService.openRazorpayCheckout(
        orderResponse.order,
        id,
        () => {
          toast.success('Payment successful! Your tickets are booked.');
          navigate('/eventmanager/user-bookings');
        },
        (err: any) => {
          toast.error(err.message || 'Payment failed or verification error');
          setIsPaying(false);
        }
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 text-white px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <HomeButton />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
              <h1 className="text-3xl font-extrabold mb-6 bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Review Your Booking
              </h1>

              <div className="flex gap-6 mb-8 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                <img
                  src={
                    event.picture || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
                  }
                  className="w-24 h-24 rounded-xl object-cover border border-white/10"
                  alt={event.title}
                />
                <div>
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {new Date(event.startTime).toLocaleString()}
                  </p>
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                    {event.eventType}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Order Summary
                </h3>
                {isOnline ? (
                  <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                    <span className="text-slate-300">Virtual Experience Pass</span>
                    <span className="font-bold text-indigo-400">₹{event.price}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                      <span className="text-slate-300">
                        In-Person Seats ({selectedSeats.length})
                      </span>
                      <span className="font-bold">₹{total}</span>
                    </div>
                    <div className="text-xs text-slate-500 italic">
                      Seats: {selectedSeats.join(', ')}
                    </div>
                  </>
                )}

                {/* Separate Commission Details card */}
                {breakdown && (
                  <div className="mt-6 p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Platform Commission ({breakdown.commissionPercentage}%)</span>
                      <span className="text-purple-400 font-semibold">₹{breakdown.commissionAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Organizer Revenue</span>
                      <span className="text-teal-400 font-semibold">₹{breakdown.organizerRevenue}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 italic">
                      Split policy applied based on Creator tier: {breakdown.planName}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 text-xl">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-black text-indigo-400">
                    ₹{total}
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-4">Payment Method</h3>
              <div className="p-4 rounded-2xl border border-indigo-500/50 bg-indigo-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Online Payment</p>
                    <p className="text-[10px] text-slate-400">Secure payment via Razorpay</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-indigo-500 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  className="w-5 h-5 text-indigo-400"
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Safe & Secure
                </span>
              </div>

              {!isOnline && timeLeft !== null && timeLeft > 0 && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">
                    Seats Reserved For
                  </p>
                  <p className="text-2xl font-black text-red-500 font-mono">
                    {Math.floor(timeLeft / 1000 / 60)}:
                    {Math.floor((timeLeft / 1000) % 60)
                      .toString()
                      .padStart(2, '0')}
                  </p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full py-4 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl font-black text-lg shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaying ? 'Processing...' : 'Pay Now'}
              </button>

              <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed">
                By clicking Pay Now, you agree to our Terms of Service and Privacy Policy. All sales
                are final.
              </p>

              <button
                onClick={handleCancel}
                className="w-full mt-4 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-700 hover:text-white transition-all"
              >
                Cancel & Back
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
