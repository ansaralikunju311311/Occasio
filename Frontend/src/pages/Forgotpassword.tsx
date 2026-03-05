
import SideImage from '../../src/assets/SideImage.jpg'
import { useForm } from 'react-hook-form'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
type ForgotPasswordForm = {
  email: string
}

const Forgotpassword = () => {

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    mode: 'onBlur',
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    // For now we just log; integrate API to send OTP here later
    console.log('Forgot password email:', data.email)



    try {
      console.log("requessssss")
      const response = await api.post("/auth/forgot-password", {
        email: data.email
      })

      console.log(response)


      localStorage.setItem("user", JSON.stringify(response.data.data));

      navigate("/resetpassword")
      console.log(response)
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }


  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side Image Section */}
      <div className="relative hidden md:block w-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 mix-blend-multiply z-10"></div>
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6 shadow-xl border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Forgot Password?
          </h2>
          <p className="text-lg text-gray-200 font-light max-w-md">
            Don't worry, it happens to the best of us. We'll help you securely recover your account.
          </p>
        </div>
      </div>

      {/* Right Side Card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-md transition-all">

          <button onClick={() => navigate('/login')} className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-8 group">
            <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </button>

          <div className="text-left mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your registered email address and we'll send you a One-Time Password to reset your credentials.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Send Recovery OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Forgotpassword
