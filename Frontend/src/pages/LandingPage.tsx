import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-6 shadow-sm border border-indigo-500/20">
            The New Standard for Events
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8 text-white">
            Discover & Book <br />
            <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Amazing Events</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Occasio makes event booking seamless with real-time seat selection,
            secure payments, and instant confirmations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-[0_0_40px_-5px_rgb(99,102,241,0.4)] hover:shadow-[0_0_60px_-10px_rgb(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 border border-white/10"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm text-white font-semibold text-lg border border-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Why Choose Occasio?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Everything you need for the perfect event experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-indigo-500/30 hover:shadow-[0_0_40px_-10px_rgb(99,102,241,0.15)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:bg-indigo-500 group-hover:border-transparent transition-all duration-300">
              <svg className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Real-Time Seat Booking
            </h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Select your exact seat with dynamic layouts and live availability updates ensuring no double bookings.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-purple-500/30 hover:shadow-[0_0_40px_-10px_rgb(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:bg-purple-500 group-hover:border-transparent transition-all duration-300">
              <svg className="w-7 h-7 text-purple-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Secure Payments
            </h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Stripe-powered secure transactions with instant booking confirmation and encrypted data processing.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 hover:border-pink-500/30 hover:shadow-[0_0_40px_-10px_rgb(236,72,153,0.15)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-8 group-hover:bg-pink-500 group-hover:border-transparent transition-all duration-300">
              <svg className="w-7 h-7 text-pink-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Event Management
            </h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Powerful dashboard for managers to create events, track analytics, and handle attendees effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_50px_-15px_rgb(99,102,241,0.3)]">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-100"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
              Ready to step into the future of events?
            </h2>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgb(255,255,255,0.2)]"
            >
              Join Occasio Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;