import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch } from "../redux/hook.ts";
import { setAuth, logout } from "../redux/slices/authSlice.ts";
import { api } from '../services/api.ts'
import LoadingSpinner from "../components/common/LoadingSpinner";
import MainLayout from "../layouts/MainLayout";

const LandingPage = lazy(() => import("../pages/LandingPage"));

const LoginPage = lazy(() => import("../pages/user/LoginPage.tsx"));
const SignPage = lazy(() => import("../pages/user/SignupPage.tsx"))
const OtpVerification = lazy(() => import("../pages/user/OtpVerification.tsx"));
const OAuthSuccess = lazy(() => import("../pages/user/OAuthSuccess.tsx"));
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
    path: "/oauth-success",
    element: <OAuthSuccess />
  },

  {
    path: "/admin",
    element: (

      <AdminLayout />



    ),
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
    element: (

      <EventManagerLayout />

    ),
    children: [
      { index: true, element: <EventManagerDashboard /> },
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






export const RouterWrapper = () => {
  const dispatch = useAppDispatch();

  const restoreSession = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data) {
        dispatch(
          setAuth({
            token: res.data.accessToken || localStorage.getItem("accessToken"),
            user: res.data.user
          })
        );
      }
    } catch (error) {
      console.log("No active session or invalid token:", error);

      dispatch(logout());
    }
  };

  useEffect(() => {
    const authPages = ["/login", "/adminlogin", "/signup", "/otpverification", "/forgotpassword", "/resetpassword"];
    const currentPath = window.location.pathname;



    if (!authPages.includes(currentPath)) {
      restoreSession();
    } else {
      console.log("On auth page, skipping session restoration");
    }
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};