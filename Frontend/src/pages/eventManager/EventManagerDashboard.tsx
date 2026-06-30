import { useAppSelector } from '../../redux/hook';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../constants';
import HomeButton from '../../components/common/HomeButton';
import { useManagerStats } from '../../hooks/useEvents';

const EventManagerDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [mySubscription, setMySubscription] = useState<any>(null);
  const { data, isLoading } = useManagerStats();

  useEffect(() => {
    if (user?.role === 'EVENT_MANAGER') {
      api
        .get(API_ENDPOINTS.USER_MY_SUBSCRIPTION)
        .then((res) => {
          if (res.data.success) {
            setMySubscription(res.data.subscription);
          }
        })
        .catch((err) => console.error('Error fetching subscription', err));
    }
  }, [user]);

  const statsData = data?.stats || {
    totalEvents: 0,
    activeEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalRefunded: 0,
  };

  const stats = [
    { title: 'Total Events', value: String(statsData.totalEvents), icon: '🎟️', trend: '+0' },
    { title: 'Active Events', value: String(statsData.activeEvents), icon: '✨', trend: '0' },
    { title: 'Total Bookings', value: String(statsData.totalBookings), icon: '🎫', trend: '+0%' },
    { title: 'Total Revenue', value: `₹${statsData.totalRevenue}`, icon: '💰', trend: '+0%' },
    { title: 'Refunded Revenue', value: `₹${statsData.totalRefunded}`, icon: '↩️', trend: '-0%' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }


  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Manager <span className="text-teal-400">Dashboard</span>
            <p className="text-sm font-normal text-slate-500 mt-1">{user?.email}</p>
          </h1>
          <p className="text-slate-400 mt-2">Overview of your events and earnings on Occasio.</p>
          <div className="mt-4">
            <HomeButton />
          </div>
        </div>

        {mySubscription && (
          <div className="bg-slate-900/60 border border-teal-500/30 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                Active Plan
              </p>
              <h4 className="text-lg font-bold text-teal-400">{mySubscription.plan} TIER</h4>
              <p className="text-xs font-medium text-slate-300 mt-1">
                Expires:{' '}
                {mySubscription.endDate
                  ? new Date(mySubscription.endDate).toLocaleDateString()
                  : 'Lifetime'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-slate-900/40 backdrop-blur-xl border rounded-2xl p-6 shadow-xl transition-all duration-300 group ${
              stat.title === 'Refunded Revenue'
                ? 'border-rose-950/60 hover:border-rose-500/30'
                : 'border-slate-800/60 hover:border-teal-500/30'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-xl border transition-transform group-hover:scale-110 ${
                stat.title === 'Refunded Revenue'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
              }`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold flex items-center px-2 py-1 rounded-lg border ${
                stat.title === 'Refunded Revenue'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
              }`}>
                {stat.title === 'Refunded Revenue' ? (
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManagerDashboard;
