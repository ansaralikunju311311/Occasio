const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-12 text-center text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase opacity-80">
          Occasio
        </h2>
        <p className="max-w-md mx-auto text-gray-500 font-light">
          Premium event experiences, seamless booking, and real-time management.
        </p>
        <div className="w-16 h-px bg-gray-700 my-4"></div>
        <p>© {new Date().getFullYear()} Occasio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
