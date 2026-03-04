import React, { useState } from 'react'
import SideImage from '../../src/assets/SideImage.jpg'
import { useForm } from 'react-hook-form'
import type { SignDataType } from '../types/auth.type'
import{ useNavigate } from 'react-router-dom'
 import {api} from '../services/api'
const SignupPage = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState<SignDataType | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignDataType>({
    mode: "onBlur"
  })
  const password = watch("password");

  const onSubmit = async(data: SignDataType) => {

  try {
     console.log("bvuvhjgyjttffyjttfyjtfyr")
     const response = await api.post("/auth/signup",{
       name:data.name,
       email:data.email,
       password:data.password,
       confirmpassword:data.confirmpassword
   })
   
   navigate("/")
    console.log('Submitted Data:', response)
    setValue(data)
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
            Join Us Today
          </h2>
        </div>
      </div>

      {/* Right Side Signup Card */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-10 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmpassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match"
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.confirmpassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmpassword.message}
                </p>
              )}
            </div>

            {/* EVENT MANAGER CHECK */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4"
              />
              <label className="ml-2 text-sm text-gray-900">
                Sign up as an Event Manager
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Sign Up
            </button>
          </form>

          {/* Submitted Data Display */}
          {/* {value && (
            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Name:</strong> {value.name}</p>
              <p><strong>Email:</strong> {value.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                {value.remember ? "eventManager" : "user"}
              </p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default SignupPage
