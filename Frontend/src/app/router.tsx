import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
const LandingPage = lazy(() => import("../pages/LandingPage"));

const LoginPage = lazy(()=>import("../pages/LoginPage"));
const SignPage =lazy(()=>import("../pages/SignupPage"))
const OtpVerification = lazy(()=>import("../pages/OtpVerification.tsx"));
const ForgotPassword  = lazy(()=>import("../pages/Forgotpassword.tsx"));
const ResetPassword = lazy(()=>import("../pages/ResetPassword.tsx"));
const AdminLogin  = lazy(()=>import("../pages/AdminLogin.tsx"))
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
  },
  
   {
         path:"/forgotpassword",
         element:<ForgotPassword/>
   },

   {
      path:"/resetpassword",
      element:<ResetPassword/>
   },
   {
    path:"/admin/login",
    element:<AdminLogin/>
   }
]);

export const RouterWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);