import { useState, useEffect } from 'react';
import { usePlans } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { setAuth } from '../../redux/slices/authSlice';
import { API_ENDPOINTS } from '../../constants';
import { paymentService } from '../../services/payment.service';

const Subscriptions = () => {
  const { data: plansData, isLoading, error } = usePlans();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mySubscription, setMySubscription] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  useEffect(() => {
    if (user?.role === 'EVENT_MANAGER') {
      setIsLoadingSubscription(true);
      api
        .get(API_ENDPOINTS.USER_MY_SUBSCRIPTION)
        .then((res) => {
          if (res.data.success) {
            // It might be null if they don't have one yet
            setMySubscription(res.data.subscription);
          }
        })
        .catch((err) => console.error('Error fetching subscription details', err))
        .finally(() => setIsLoadingSubscription(false));
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-white text-center py-20">Error loading plans</div>;

  const apiPlans = plansData?.plans || [];

  const handleSubscribe = async (planId: string, price: string) => {
    if (user?.role === 'USER') {
      toast.error('You must be an Event Manager to subscribe to plans.');
      navigate('/applyasmanager');
      return;
    }

    setIsProcessing(true);
    try {
      // Check if price is Free or 0
      const numericPrice = parseFloat(price.replace('₹', ''));

      if (numericPrice === 0) {
        const res = await api.post(API_ENDPOINTS.USER_SUBSCRIBE, { planId });
        if (res.data.success) {
          toast.success('Successfully subscribed to plan!');
          dispatch(setAuth({ user: res.data.user }));
        }
      } else {
        // Paid plan flow
        const orderResponse = await paymentService.createSubscriptionOrder(planId);

        paymentService.openRazorpaySubscriptionCheckout(
          orderResponse.order,
          planId,
          async () => {
            toast.success('Payment successful! Your subscription is upgraded.');
            // Refetch user data
            const res = await api.get(API_ENDPOINTS.AUTH_ME);
            if (res.data) {
              dispatch(setAuth({ user: res.data.user }));
            }
          },
          (err: any) => {
            toast.error(err.message || 'Payment failed or verification error');
          }
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe to plan');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = apiPlans.map((plan: any) => {
    // Basic logic to determine if current plan
    const planId = plan.id || plan._id;
    const isCurrent =
      (mySubscription && mySubscription.plan === plan.name) ||
      (!user?.activeSubscription && plan.name === 'FREE');

    return {
      id: planId,
      name: plan.name,
      price: `₹${plan.price}`,
      period: '/per month',
      commission: `${plan.commissionPercentage}%`,
      limit: plan.eventLimit === 0 ? 'Unlimited events' : `Up to ${plan.eventLimit} events/month`,
      description: `Get ${plan.eventLimit === 0 ? 'unlimited' : plan.eventLimit} events per month with a low ${plan.commissionPercentage}% commission rate.`,
      features: plan.features,
      color: plan.name === 'PRO' ? 'teal' : plan.name === 'ELITE' ? 'indigo' : 'slate',
      buttonText:
        user?.role === 'USER'
          ? 'Upgrade to Event Manager'
          : isCurrent
            ? 'Current Plan'
            : `Upgrade to ${plan.name}`,
      isCurrent: user?.role === 'USER' ? false : isCurrent,
      popular: plan.name === 'PRO',
    };
  });

  return (
    <div className="relative min-h-full pb-20">
      {/* Header section */}
      <div className="text-center mb-16 animation-slide-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Manager{' '}
          <span className="bg-linear-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
            Subscription Plans
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Scale your event management business with our flexible pricing tiers. Choose the plan that
          best fits your event frequency and volume.
        </p>
      </div>

      {/* Current Subscription Status */}
      {user?.role === 'EVENT_MANAGER' && (
        <div className="max-w-4xl mx-auto mb-16">
          {isLoadingSubscription ? (
            <div className="p-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-xl flex justify-center items-center">
              <span className="text-slate-400">Loading subscription details...</span>
            </div>
          ) : mySubscription ? (
            <div className="p-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-xl animation-slide-up text-white">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-widest text-teal-400 mb-2">
                    {mySubscription.plan} Plan
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      mySubscription.status === 'ACTIVE'
                        ? 'bg-teal-500/20 text-teal-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {mySubscription.status}
                  </span>
                </div>

                <div className="flex-1 w-full md:px-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                      Events Used
                    </span>
                    <span className="text-sm font-bold">
                      {mySubscription.eventsUsed} /{' '}
                      {mySubscription.eventLimit === 0 ? 'Unlimited' : mySubscription.eventLimit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{
                        width:
                          mySubscription.eventLimit === 0
                            ? '10%'
                            : `${Math.min((mySubscription.eventsUsed / mySubscription.eventLimit) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
                    Expiry Date
                  </p>
                  <p className="font-bold">
                    {mySubscription.endDate
                      ? new Date(mySubscription.endDate).toLocaleDateString()
                      : 'Lifetime (No Expiry)'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl text-center">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-2">
                No Active Subscription
              </h3>
              <p className="text-slate-500 font-light">
                You currently do not have an active manager subscription. Please select a plan below
                to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan: any, index: number) => (
          <div
            key={plan.name}
            className={`relative group bg-[#0a0f16] border rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col h-full hover:-translate-y-2
              ${plan.popular ? 'border-teal-500/50 shadow-[0_0_40px_-10px_rgb(20,184,166,0.2)]' : 'border-slate-800 hover:border-slate-700 shadow-xl'}
              ${index === 0 ? 'animation-slide-up' : index === 1 ? 'animation-slide-up-delay' : 'stagger-animation'}
            `}
          >
            {plan.popular && !plan.isCurrent && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-[#070b14] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            {plan.isCurrent && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-800 text-teal-400 border border-teal-500/30 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                Active Plan
              </div>
            )}

            <div className="mb-8">
              <h3
                className={`text-xl font-bold uppercase tracking-[0.2em] mb-2 ${
                  plan.color === 'teal'
                    ? 'text-teal-400'
                    : plan.color === 'indigo'
                      ? 'text-indigo-400'
                      : 'text-slate-400'
                }`}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed min-h-[3rem]">
                {plan.description}
              </p>
            </div>

            <div className="space-y-6 mb-10 flex-1">
              {/* Key Metrics */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Commission
                  </span>
                  <span className="text-sm text-white font-bold">{plan.commission} per ticket</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      plan.color === 'teal'
                        ? 'bg-teal-500'
                        : plan.color === 'indigo'
                          ? 'bg-indigo-500'
                          : 'bg-slate-500'
                    }`}
                    style={{
                      width: plan.name === 'Free' ? '30%' : plan.name === 'Pro' ? '60%' : '90%',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Volume
                  </span>
                  <span className="text-sm text-white font-bold">{plan.limit}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                    <div
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                        plan.color === 'teal'
                          ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                          : plan.color === 'indigo'
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                      }`}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe(plan.id, plan.price)}
              disabled={plan.isCurrent || isProcessing}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95
                ${
                  plan.isCurrent
                    ? 'bg-slate-800/50 text-slate-500 border border-slate-700 cursor-default'
                    : plan.color === 'teal'
                      ? 'bg-teal-500 text-[#070b14] hover:bg-teal-400 hover:shadow-[0_10px_25px_-5px_rgb(20,184,166,0.4)]'
                      : 'bg-white text-[#070b14] hover:bg-slate-200 hover:shadow-[0_10px_25px_-5px_rgb(255,255,255,0.2)]'
                }
              `}
            >
              {isProcessing ? 'Processing...' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Info Section */}
      <div className="mt-20 max-w-4xl mx-auto p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm text-center animation-slide-up-delay">
        <h4 className="text-white font-bold mb-4">Need a Custom Enterprise Solution?</h4>
        <p className="text-slate-400 text-sm font-light mb-6">
          If you're hosting large-scale festivals or managing a stadium with over 50,000 capacity,
          contact our team for a tailored commission structure and infrastructure.
        </p>
        <button className="text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors uppercase tracking-widest">
          Contact Support →
        </button>
      </div>
    </div>
  );
};

export default Subscriptions;
