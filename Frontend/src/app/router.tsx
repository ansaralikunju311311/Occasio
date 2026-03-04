import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
const LandingPage = lazy(() => import("../pages/LandingPage"));

const LoginPage = lazy(()=>import("../pages/LoginPage"));
const SignPage =lazy(()=>import("../pages/SignupPage"))
const OtpVerification = lazy(()=>import("../pages/OtpVerification.tsx"))
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      //  { path: "/login", element: <LoginPage /> },
    ],
  },

 {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path:"/signup",
    element:<SignPage/>,
  },

    
  {
    path:"/otpverification",
    element:<OtpVerification/>
  }


]);

export const RouterWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);