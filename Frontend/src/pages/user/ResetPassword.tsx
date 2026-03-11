import React from 'react'
import SideImage from '../../assets/SideImage.jpg'
import { useForm } from 'react-hook-form'
import { api } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
type ResetPasswordForm = {
  otp: string
  password: string
  confirmpassword: string
}

const ResetPassword: React.FC = () => {


  const [timeleft, setTimeleft] = useState(60)
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: 'onBlur',
  })



  useEffect(() => {

    if (!user?.otpSendAt) return;

    const sentTime = new Date(user.otpSendAt).getTime()

    const resendTime = sentTime + 60 * 1000

    const timer = setInterval(() => {

      const now = new Date().getTime()

      const remaining = Math.floor((resendTime - now) / 1000)

      if (remaining <= 0) {
        setTimeleft(0)
        clearInterval(timer)
      } else {
        setTimeleft(remaining)
      }

    }, 1000)

    return () => clearInterval(timer)

  }, [user.otpSendAt])

  const onSubmit = async (data: ResetPasswordForm) => {


    try {


      const response = await api.post("/auth/reset-password", {

        otp: data.otp,
        password: data.password,
        confirmpassword: data.confirmpassword,
        email: user.email

      })


      console.log("re", response);




    
      console.log('Reset password data:', data);
      toast.success("Password reset successfully! Please login.");
      localStorage.removeItem("user");
      navigate("/login")
    } catch (error: any) {

      // localStorage.removeItem("user");

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }

    }

  }

  const resendOtp = async () => {


    try {
      const response = await api.post("/auth/resend-otp", {
        email: user.email
      })

      console.log(response)
      toast.success("New OTP sent to your email!");

    } catch (error: any) {


      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }

    }

  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side Image Section */}
      <div className="relative hidden md:block w-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/90 to-purple-900/90 mix-blend-multiply z-10"></div>
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6 shadow-xl border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300">
            Secure Your Account
          </h2>
          <p className="text-lg text-gray-200 font-light max-w-md">
            Enter the OTP sent to your email and choose a strong new password.
          </p>
        </div>
      </div>

      {/* Right Side Card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="bg-white p-8 md:p-12 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-md transition-all h-full max-h-screen overflow-y-auto custom-scrollbar">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-500">Please enter your verification code and new password.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* OTP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification OTP
              </label>
              <input
                type="text"
                placeholder="Enter 4-digit OTP minimum"
                {...register('otp', {
                  required: 'OTP is required',
                  minLength: {
                    value: 4,
                    message: 'OTP must be at least 4 digits',
                  },
                })}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all tracking-widest font-mono text-center"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Min 8 chars, include uppercase, lowercase, number & special character',
                  },
                })}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                {...register('confirmpassword', {
                  required: 'Confirm password is required',
                  validate: (value) =>
                    value === getValues('password') ||
                    'Passwords do not match',
                })}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.confirmpassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmpassword.message}
                </p>
              )}

              <div className="mt-4 text-sm flex justify-between items-center">
                <span className="text-gray-500">Didn’t receive the code?</span>
                {timeleft > 0 ? (
                  <span className="text-gray-400 font-medium">
                    Resend in <span className="text-indigo-500">{timeleft}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
