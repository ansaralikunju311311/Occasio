
import SideImage from "../../src/assets/SideImage.jpg";
import type { OtpData } from "../types/auth.type";
import { useForm } from "react-hook-form";
import {api} from '../services/api'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OtpVerification = () => {


  const [timeleft,setTimeLeft] = useState(60)
  const navigate = useNavigate();
    const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm<OtpData>({
       mode: "onBlur", // validation triggers when leaving input
     });
      

     const user = JSON.parse(localStorage.getItem("user") || "{}");

// console.log(user.email);




   useEffect(() => {

  if(!user?.otpSendAt) return;

  const sentTime = new Date(user.otpSendAt).getTime()

  const resendTime = sentTime + 60 * 1000

  const timer = setInterval(()=>{

     const now = new Date().getTime()

     const remaining = Math.floor((resendTime - now) / 1000)

     if(remaining <= 0){
        setTimeLeft(0)
        clearInterval(timer)
     }else{
        setTimeLeft(remaining)
     }

  },1000)

  return ()=> clearInterval(timer)

},[])

   const resendOtp = async ()=>{
        
      try {
         const details = await api.post("/auth/resend-otp",{
          email:user.email
         })

       console.log(details)
      } catch (error:any) {
        

           
          if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong");
    }
      }

   }
     const onSubmit =async (data:OtpData)=>{
      console.log(data)

      try {
          const  response =  await api.post("/auth/verify-otp",{
            email:user.email,
            otp:data.otp
          })
          console.log(response);
          navigate("/")
      } catch (error:any) {
         if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong");
    }
      }
     }
  return (
    <div className="min-h-screen flex">
      {/* Left Side Image Section */}
      <div className="relative hidden md:block w-1/2">
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6">
          <h2 className="text-3xl font-bold text-center">
            Verify Your Account
          </h2>
          <p className="mt-3 text-sm text-gray-200 max-w-xs text-center">
            Enter the one-time password sent to your email to complete your
            registration.
          </p>
        </div>
      </div>

      {/* Right Side OTP Card */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-10 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            OTP Verification
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            We have sent a 6-digit verification code to your email.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* OTP INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>

              {/* Single Input (you can later replace with 6 separate boxes if you want) */}
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="mt-1 block w-full tracking-widest text-center text-lg px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               
                 {...register("otp", {
                  required: "otp is required",
                  minLength: {
                    value: 6,
                    message: "otp must be at is 6 number"
                  }
                })}



             />
            {errors.otp && (
                <p className="text-red-500 text-sm">
                  {errors.otp.message}
                </p>
              )}
              {/* <p className="mt-2 text-xs text-gray-500">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                  onClick={resendOtp}  >
                  Resend OTP
                </button>
              </p> */}
              <p className="mt-2 text-xs text-gray-500">
  Didn’t receive the code?{" "}

  {timeleft > 0 ? (
    <span className="text-gray-400">
      Resend in {timeleft}s
    </span>
  ) : (
    <button
      type="button"
      className="text-indigo-600 hover:text-indigo-700 font-medium"
      onClick={resendOtp}
    >
      Resend OTP
    </button>
  )}
</p>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
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
