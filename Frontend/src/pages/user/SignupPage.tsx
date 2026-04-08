import SideImage from '../../assets/SideImage.jpg';
import { useForm } from 'react-hook-form';
import type { SignDataType } from '../../types/auth.type';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import PasswordInput from '../../components/common/PasswordInput';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

const SignupPage = () => {
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: (data: SignDataType) =>
      api.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
        role: 'USER',
      }),
    onSuccess: (response) => {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      toast.success('Account created! Please verify your email.');
      navigate('/otpverification');
    },
    onError: (error: any) => {
      if (error.response) {
        toast.error(error.response.data.message || 'Signup failed');
      } else {
        toast.error('Something went wrong');
      }
    },
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignDataType>({
    mode: 'onBlur',
  });

  const onSubmit = (data: SignDataType) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side Image Section */}
      <div className="relative hidden md:block w-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 mix-blend-multiply z-10"></div>
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000 opacity-60"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Join Occasio Today
          </h2>
          <p className="text-lg text-slate-300 font-light max-w-md">
            Start your journey to unforgettable events and seamless management.
          </p>
        </div>
      </div>

      {/* Right Side Signup Card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-indigo-500/10 border border-slate-800 w-full max-w-md transition-all h-full max-h-screen overflow-y-auto custom-scrollbar">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-slate-400">Sign up to get started with Occasio.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register('name', {
                  required: 'Name is required',
                  validate: (value) =>
                    value.trim().length >= 3 || 'Name must contain at least 3 valid characters',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]{3,}@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email with at least 3 characters before @',
                  },
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
              <PasswordInput
                placeholder="Enter password"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Min 8 chars, include uppercase, lowercase, number & special character',
                  },
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <PasswordInput
                placeholder="Confirm password"
                {...register('confirmpassword', {
                  required: 'Confirm password is required',
                  validate: (value) => value === getValues('password') || 'Passwords do not match',
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.confirmpassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmpassword.message}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgb(99,102,241,0.3)] hover:shadow-[0_0_25px_rgb(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-200 border border-white/10"
            >
              Sign Up
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
            <span>Sign up with Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
