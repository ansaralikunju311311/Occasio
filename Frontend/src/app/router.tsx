import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
const LandingPage = lazy(() => import("../pages/LandingPage"));

const LoginPage = lazy(() => import("../pages/user/LoginPage.tsx"));
const SignPage = lazy(() => import("../pages/user/SignupPage.tsx"))
const OtpVerification = lazy(() => import("../pages/user/OtpVerification.tsx"));
const ForgotPassword = lazy(() => import("../pages/user/Forgotpassword.tsx"));
const ResetPassword = lazy(() => import("../pages/user/ResetPassword.tsx"))

const AdminLogin = lazy(() => import("../pages/admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.tsx"));
const AdminPlaceholder = lazy(() => import("../pages/admin/AdminPlaceholder.tsx"));

const EventManagerLayout = lazy(() => import("../layouts/EventManagerLayout.tsx"));
const EventManagerDashboard = lazy(() => import("../pages/eventManager/EventManagerDashboard.tsx"));
const EventManagerPlaceholder = lazy(() => import("../pages/eventManager/EventManagerPlaceholder.tsx"));

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
    path: "/eventmanager",
    element: <EventManagerLayout />,
    children: [
      { index:true, element: <EventManagerDashboard /> },
      { path: "create-event", element: <EventManagerPlaceholder /> },
      { path: "my-events", element: <EventManagerPlaceholder /> },
      { path: "bookings", element: <EventManagerPlaceholder /> },
      { path: "wallet", element: <EventManagerPlaceholder /> },
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