import React from 'react'
import SideImage from '../../src/assets/SideImage.jpg'
import { useForm } from 'react-hook-form'

type ForgotPasswordForm = {
  email: string
}

const Forgotpassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    mode: 'onBlur',
  })

  const onSubmit = (data: ForgotPasswordForm) => {
    // For now we just log; integrate API to send OTP here later
    console.log('Forgot password email:', data.email)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image Section (same style as Signup) */}
      <div className="relative hidden md:block w-1/2">
        <img
          src={SideImage}
          alt="background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6">
          <h2 className="text-3xl font-bold text-center">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Enter your registered email to receive an OTP
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
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Forgotpassword
