import { useState } from "react";
import SideImage from '../../src/assets/SideImage.jpg'
import { useForm } from "react-hook-form";
import type { LoginDataType } from "../types/auth.type";
import {api} from '../services/api'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [value, setValue] = useState<LoginDataType | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataType>({
    mode: "onBlur", // validation triggers when leaving input
  });


  console.log(value)
  const onSubmit = async(data: LoginDataType) => {
        const roleValue = data.remember ? "EVENT_MANAGER":"USER"

   

    
      try {
          
        const response = await api.post("/auth/login",{
          email:data.email,
           password:data.password,
          role:roleValue


        })
        console.log(response);

        navigate("/");

        
      } catch (error:any) {
        
     if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong");
    }


      }
   
   
   
   
   
   
    console.log("Submitted Data:", data);
    setValue(data);
    
  };


    
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
          {/* <img src="/logo.png" alt="Logo" className="h-16 mb-4" /> */}
          <h2 className="text-3xl font-bold text-center">
            Your Tagline Goes Here
          </h2>
        </div>
      </div>

      {/* Right Side Login Card */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-10 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Welcome Back
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* REMEMBER */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4"
              />
              <label className="ml-2 text-sm text-gray-900">
                Login As a EventManager
              </label>

              <p><Link to="/forgotpassword">forgot password</Link></p>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Log In
            </button>
          </form>
          <p>Not register Please<Link to="/signup">Signup</Link> </p>

          {/* Submitted Data Display */}
          {/* {value && (
            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Email:</strong> {value.email}</p>
              <p><strong>Password:</strong> {value.password}</p>
              <p>
                <strong>Role:</strong>{" "}
                {value.remember ? "eventManager" : "user"}
              </p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
