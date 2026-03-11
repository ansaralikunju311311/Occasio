
import SideImage from '../../assets/SideImage.jpg'
import type { OtpData } from "../../types/auth.type";
import { useForm } from "react-hook-form";
import { api } from '../../services/api'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from '../../redux/hook';
import { setAuth } from '../../redux/slices/authSlice';
import { toast } from 'sonner';
const OtpVerification = () => {


  const [timeleft, setTimeLeft] = useState(60)
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpData>({
    mode: "onBlur", // validation triggers when leaving input
  });

  // console.log(user.email);




  useEffect(() => {

    if (!userData?.otpSendAt) return;

    const sentTime = new Date(userData.otpSendAt).getTime()

    const resendTime = sentTime + 60 * 1000

    const timer = setInterval(() => {

      const now = new Date().getTime()

      const remaining = Math.floor((resendTime - now) / 1000)

      if (remaining <= 0) {
        setTimeLeft(0)
        clearInterval(timer)
      } else {
        setTimeLeft(remaining)
      }

    }, 1000)

    return () => clearInterval(timer)

  }, [userData.otpSendAt])

  const resendOtp = async () => {

    try {
      const details = await api.post("/auth/resend-otp", {
        email: userData.email
      })

      console.log(details)
      toast.success("OTP resent successfully!");

      const updatedUser = { ...userData, otpSendAt: new Date().toISOString() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setTimeLeft(60);

    } catch (error: any) {



      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }

  }
  const onSubmit = async (data: OtpData) => {
    console.log(data)

    try {
      const response = await api.post("/auth/verify-otp", {
        email: userData.email,
        otp: data.otp
      })
      console.log(response);
      toast.success("OTP verified!");
      localStorage.removeItem("user");
      localStorage.setItem("accessToken", response.data.accessToken)

      dispatch(
        setAuth({
          token: response.data.accessToken,
          user: response.data.user
        })
      )


      if (response.data.user.role === "EVENT_MANAGER") {
        navigate("/eventmanager")
      }
      else if (response.data.user.role === "USER") {
        navigate("/")
      }

    } catch (error: any) {
      console.log("error happen incorrect  otp")
      // localStorage.removeItem("user");
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300">
            Verify Your Account
          </h2>
          <p className="mt-3 text-lg text-gray-200 font-light max-w-md">
            Enter the one-time password sent to your email to complete your
            registration securely.
          </p>
        </div>
      </div>

      {/* Right Side OTP Card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="bg-white p-8 md:p-12 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-md transition-all">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              OTP Verification
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              We have sent a 6-digit verification code to your email.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* OTP INPUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                className="block w-full text-center tracking-[0.5em] text-3xl px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be exactly 6 digits"
                  }
                })}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errors.otp.message}
                </p>
              )}

              <div className="mt-6 text-center text-sm flex items-center justify-center gap-2">
                <span className="text-gray-500">Didn’t receive the code?</span>
                {timeleft > 0 ? (
                  <span className="font-semibold text-gray-400">
                    Resend in <span className="text-indigo-500">{timeleft}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
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
              Verify & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
