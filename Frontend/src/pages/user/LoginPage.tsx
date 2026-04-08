import SideImage from '../../assets/SideImage.jpg';
import { useForm } from 'react-hook-form';
import type { LoginDataType } from '../../types/auth.type';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PasswordInput from '../../components/common/PasswordInput';
import { useAppDispatch } from '../../redux/hook';
import { setAuth } from '../../redux/slices/authSlice';
import { toast } from 'sonner';
// import { useDispatch } from "react-redux";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataType>({
    mode: 'onBlur',
  });

  console.log('user');
  const onSubmit = async (data: LoginDataType) => {
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
        role: 'USER',
      });
      console.log('response', response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);

      dispatch(
        setAuth({
          user: response.data.user,
        })
      );

      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login failed');
      } else {
        toast.error('Something went wrong');
      }
    }

    // console.log("Submitted Data:", data);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side Image Section */}
      <div className="relative hidden md:block w-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/90 to-purple-900/90 mix-blend-multiply z-10"></div>
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000 opacity-60"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Welcome Back to Occasio
          </h2>
          <p className="text-lg text-slate-300 font-light max-w-md">
            Your gateway to the best premium event experiences. Let's get you back in.
          </p>
        </div>
      </div>

      {/* Right Side Login Card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-4xl shadow-2xl shadow-indigo-500/10 border border-slate-800 w-full max-w-md transition-all">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Log In</h1>
            <p className="mt-2 text-sm text-slate-400">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <PasswordInput
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Min 8 chars, include uppercase, lowercase, number & special character',
                  },
                })}
                className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* REMEMBER & FORGOT */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center"></div>

              <Link
                to="/forgotpassword"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgb(99,102,241,0.3)] hover:shadow-[0_0_25px_rgb(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-200 border border-white/10"
            >
              Log In
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-medium border border-slate-800 transition-all duration-200"
            onClick={() => {
              window.location.href = `http://localhost:3001/api/auth/google?role=USER`;
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
