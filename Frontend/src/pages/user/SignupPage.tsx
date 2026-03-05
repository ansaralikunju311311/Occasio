import { useState } from 'react'
import SideImage from '../../assets/SideImage.jpg'
import { useForm } from 'react-hook-form'
import type { SignDataType } from '../../types/auth.type'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Link } from 'react-router-dom'
const SignupPage = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState<SignDataType | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<SignDataType>({
    mode: "onBlur"
  })

  console.log(value)




  const onSubmit = async (data: SignDataType) => {
    const roleValue = data.remember ? "EVENT_MANAGER" : "USER"
    try {
      console.log("bvuvhjgyjttffyjttfyjtfyr")
      const response = await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
        role: roleValue
      })


      localStorage.setItem("user", JSON.stringify(response.data.data));

      navigate("/otpverification")
      console.log('Submitted Data:', response)
      setValue(data)
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  }

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
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-400">Sign up to get started with Occasio.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters"
                  }
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Min 8 chars, include uppercase, lowercase, number & special character",
                  },
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmpassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match"
                })}
                className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.confirmpassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmpassword.message}
                </p>
              )}
            </div>

            {/* EVENT MANAGER CHECK */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="managerCheck"
                {...register("remember")}
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-slate-700 bg-slate-900 rounded cursor-pointer"
              />
              <label htmlFor="managerCheck" className="ml-2 block text-sm text-slate-300 cursor-pointer">
                Sign up as an Event Manager
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgb(99,102,241,0.3)] hover:shadow-[0_0_25px_rgb(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-200 border border-white/10"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage
