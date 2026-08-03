import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { logout } from '../../redux/slices/authSlice';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../constants';
import { useState } from 'react';
import { toast } from 'sonner';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH_LOGOUT);
      console.log(response);
      localStorage.removeItem('accessToken');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: unknown) {
      console.log(error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg shadow-sm border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          <Link to="/" onClick={closeMobileMenu}>
            Occasio
          </Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          <Link
            to="/"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/events"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Events
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/bookings"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                My Bookings
              </Link>
              <NotificationBell />
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Logout
              </button>
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : '/eventmanager'}
                className="text-sm font-medium px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          {isAuthenticated && <NotificationBell />}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none rounded-lg border border-slate-800 bg-slate-900/50"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-6 space-y-4 animate-fade-in">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block text-base font-medium text-slate-200 hover:text-indigo-400 transition-colors py-2"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={closeMobileMenu}
            className="block text-base font-medium text-slate-200 hover:text-indigo-400 transition-colors py-2"
          >
            Events
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/bookings"
                onClick={closeMobileMenu}
                className="block text-base font-medium text-slate-200 hover:text-indigo-400 transition-colors py-2"
              >
                My Bookings
              </Link>
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : '/eventmanager'}
                onClick={closeMobileMenu}
                className="block text-center text-base font-medium px-5 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white transition-all shadow-md"
              >
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  setShowLogoutModal(true);
                }}
                className="w-full text-left text-base font-medium text-red-400 hover:text-red-300 transition-colors py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block text-center text-base font-medium py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMobileMenu}
                className="block text-center text-base font-medium py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          ></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold rounded-xl transition-colors border border-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
