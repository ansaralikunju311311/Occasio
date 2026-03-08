import { useState } from "react";
import SideImage from "../../assets/SideImage.jpg"
import { useForm } from "react-hook-form";
import type { LoginDataType } from "../../types/auth.type";
import { api } from '../../services/api'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { useAppDispatch } from "../../redux/hook";
// import { setAuth } from "../../redux/slices/authSlice";
// import { useDispatch } from "react-redux";
const LoginPage = () => {
  const [value, setValue] = useState<LoginDataType | null>(null);
  const navigate = useNavigate();
  // const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataType>({
    mode: "onBlur", // validation triggers when leaving input
  });

  console.log("user")
  // console.log(value)
  const onSubmit = async (data: LoginDataType) => {
    const roleValue = data.remember ? "EVENT_MANAGER" : "USER"




    try {

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
        role: roleValue


      })
         console.log("response",response.data.accessToken)

      // dispatch(
      //   setAuth({
      //       token:response.data.accessToken,
      //       user:response.data.user
      //   })
      // )
      // console.log("resonse",response);


      // console.log("the login respose are cming from the backend",response.data)
   


      if(response.data.user.role === "EVENT_MANAGER"){
         navigate("/eventmanager")
      }
      else if(response.data.user.role=== "USER"){
              navigate("/");
      }
      
  

    } catch (error: any) {

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }


    }






    // console.log("Submitted Data:", data);
    setValue(data);

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
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Log In
            </h1>
            <p className="mt-2 text-sm text-slate-400">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Min 8 chars, include uppercase, lowercase, number & special character",
                  },
                })}
                className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* REMEMBER & FORGOT */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  {...register("remember")}
                  className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-slate-700 bg-slate-900 rounded cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-300 cursor-pointer">
                  Login as Event Manager
                </label>
              </div>

              <Link to="/forgotpassword" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
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

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
