import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
const LandingPage = lazy(() => import("../pages/LandingPage"));

const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignPage = lazy(() => import("../pages/SignupPage"))
const OtpVerification = lazy(() => import("../pages/OtpVerification.tsx"));
const ForgotPassword = lazy(() => import("../pages/Forgotpassword.tsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.tsx"))

const AdminLogin = lazy(() => import("../pages/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.tsx"));
const AdminPlaceholder = lazy(() => import("../pages/admin/AdminPlaceholder.tsx"));

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
    path: "/signup",
    element: <SignPage />,
  },


  {
    path: "/otpverification",
    element: <OtpVerification />
  },

  {
    path: "/forgotpassword",
    element: <ForgotPassword />
  },

  {
    path: "/resetpassword",
    element: <ResetPassword />
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "events", element: <AdminPlaceholder /> },
      { path: "users", element: <AdminPlaceholder /> },
      { path: "eventmanagers", element: <AdminPlaceholder /> },
      { path: "categories", element: <AdminPlaceholder /> },
      { path: "wallet", element: <AdminPlaceholder /> },
    ]
  },

  {
    path: "/adminlogin",
    element: <AdminLogin />
  }

]);

export const RouterWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);