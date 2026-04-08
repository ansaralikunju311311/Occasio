import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';
import HomeButton from '../../components/common/HomeButton';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { selectedSeats = [], bookingType = 'physical' } = location.state || {};

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/eventDetails/${id}`);
        setEvent(response.data.events);
      } catch {
        toast.error('Failed to load event details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!event) return null;

  const isOnline = event.eventType === 'ONLINE' || bookingType === 'online';

  // Calculate total
  let total = 0;
  if (isOnline) {
    total = event.price || 0;
  } else {
    // This is a simple calculation; in a real app, we'd match seat IDs to blocks
    // For now, let's assume SeatSelection passed the correct context or we'd re-calculate.
    // Actually, we should probably pass the total from SeatSelection state to be safe.
    total = location.state?.totalPrice || 0;
  }

  const handlePayment = () => {
    // UI Only - no functionality
    toast.success('Ready for payment integration!');
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
                      <span className="font-bold">₹{location.state?.totalPrice}</span>
                    </div>
                    <div className="text-xs text-slate-500 italic">
                      Seats: {selectedSeats.join(', ')}
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-4 text-xl">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-black text-indigo-400">
                    ₹{total || location.state?.totalPrice}
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
                    <p className="font-bold text-sm">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400">Secure payment via Stripe</p>
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

              <button
                onClick={handlePayment}
                className="w-full py-4 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl font-black text-lg shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] active:scale-95 transition-all duration-300"
              >
                Pay Now
              </button>

              <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed">
                By clicking Pay Now, you agree to our Terms of Service and Privacy Policy. All sales
                are final.
              </p>

              <button
                onClick={() => navigate(-1)}
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
