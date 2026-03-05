import React from 'react'
import SideImage from '../../src/assets/SideImage.jpg'
import { useForm } from 'react-hook-form'
import {api} from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
type ResetPasswordForm = {
  otp: string
  password: string
  confirmpassword: string
}

const ResetPassword: React.FC = () => {


  const [timeleft,setTimeleft] = useState(60)
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
  
    if(!user?.otpSendAt) return;
  
    const sentTime = new Date(user.otpSendAt).getTime()
  
    const resendTime = sentTime + 60 * 1000
  
    const timer = setInterval(()=>{
  
       const now = new Date().getTime()
  
       const remaining = Math.floor((resendTime - now) / 1000)
  
       if(remaining <= 0){
          setTimeleft(0)
          clearInterval(timer)
       }else{
          setTimeleft(remaining)
       }
  
    },1000)
  
    return ()=> clearInterval(timer)
  
  },[])
     
  const onSubmit = async(data: ResetPasswordForm) => {


     try {
      

          const response = await api.post("/auth/reset-password",{
       
      otp:data.otp,
      password:data.password,
      confirmpassword:data.confirmpassword,
      email:user.email

    })


    console.log("re",response);



      
    // For now we just log; integrate API to verify OTP & reset password here later
    console.log('Reset password data:', data);
    localStorage.removeItem("user");
    navigate("/login")
     } catch (error:any) {

    // localStorage.removeItem("user");

          if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong");
    }
      
     }

  }

  const resendOtp =async ()=>{


       try {
          const data = await api.post("/auth/resend-otp",{
        email:user.email
       })
      
       console.log(data)

       } catch (error:any) {
        

              if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong");
    }
      
       }
       


       console.log(data)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image Section (same style as Signup / Forgotpassword) */}
      <div className="relative hidden md:block w-1/2">
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6">
          <h2 className="text-3xl font-bold text-center">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Enter the OTP sent to your email and choose a new password
          </p>
        </div>
      </div>

      {/* Right Side Card */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-10 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Reset Password
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                {...register('otp', {
                  required: 'OTP is required',
                  minLength: {
                    value: 4,
                    message: 'OTP must be at least 4 digits',
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.confirmpassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmpassword.message}
                </p>
              )}




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
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
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
