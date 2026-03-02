const LandingPage = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6 bg-gradient-to-br: from-gray-50 to-gray-100">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Discover & Book <span className="text-black">Amazing Events</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Occasio makes event booking seamless with real-time seat selection,
          secure payments, and instant confirmations.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-black text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="border border-black px-8 py-3 rounded-lg hover:bg-black hover:text-white transition"
          >
            Login
          </a>
        </div>
      </section>


      {/* FEATURES SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">
          Why Choose Occasio?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="p-8 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">
              Real-Time Seat Booking
            </h3>
            <p className="text-gray-600">
              Select your exact seat with dynamic layouts and live availability updates.
            </p>
          </div>

          <div className="p-8 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">
              Secure Payments
            </h3>
            <p className="text-gray-600">
              Stripe-powered secure transactions with instant booking confirmation.
            </p>
          </div>

          <div className="p-8 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">
              Smart Event Management
            </h3>
            <p className="text-gray-600">
              Event managers can create, manage and track analytics in real-time.
            </p>
          </div>

        </div>
      </section>


      {/* CTA SECTION */}
      <section className="bg-black text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-6">
          Ready to experience seamless event booking?
        </h2>

        <a
          href="/signup"
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Join Occasio Today
        </a>
      </section>

    </div>
  );
};

export default LandingPage;