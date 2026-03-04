import React from "react";
import SideImage from "../../src/assets/SideImage.jpg";

const OtpVerification = () => {
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

          <form className="space-y-6">
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
              />

              <p className="mt-2 text-xs text-gray-500">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Resend OTP
                </button>
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
