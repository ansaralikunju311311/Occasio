import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { logout } from "../../redux/slices/authSlice";
import { api } from "../../services/api";


const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  console.log("checking this is working", user)
  const handleLogout = async () => {



    try {
      const response = await api.post("/auth/logout");
      console.log(response)
      localStorage.removeItem("accessToken")
      dispatch(logout());
      navigate("/");
    } catch (error) {

      console.log(error)
    }

  };

  return (
    <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-lg shadow-sm border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          <Link to="/">Occasio</Link>
        </h1>
        <nav className="space-x-8 flex items-center pr-4">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>

          {isAuthenticated && user ? (
            <>
              {user.role === "USER" && (
                <Link to="/bookings" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">My Bookings</Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Logout
              </button>
              <Link
                to={user.role === "ADMIN" ? "/admin/dashboard" : user.role === "EVENT_MANAGER" ? "/eventmanager" : "/profile"}
                className="text-sm font-medium px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                {user.role === "ADMIN" ? "Admin Panel" : user.role === "EVENT_MANAGER" ? "Manager Panel" : "Profile"}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="text-sm font-medium px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
