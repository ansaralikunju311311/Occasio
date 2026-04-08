import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { logout } from '../../redux/slices/authSlice';
import { api } from '../../services/api';
import { useState } from 'react';
import { toast } from 'sonner';

const Navbar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log('checking this is working', user);
  const handleLogout = async () => {
    try {
      const response = await api.post('/auth/logout');
      console.log(response);
      localStorage.removeItem('accessToken');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-lg shadow-sm border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          <Link to="/">Occasio</Link>
        </h1>
        <nav className="space-x-8 flex items-center pr-4">
          <Link
            to="/"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Home
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/bookings"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                My Bookings
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
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
      </div>

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
