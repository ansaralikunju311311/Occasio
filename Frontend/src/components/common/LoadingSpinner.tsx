const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100"></div>

        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>

        <div className="absolute inset-0 w-16 h-16 rounded-full bg-indigo-500/10 blur-xl animate-pulse"></div>
      </div>

      <div className="absolute mt-24">
        <span className="text-sm font-medium text-gray-600 tracking-widest uppercase animate-pulse">
          Loading
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
