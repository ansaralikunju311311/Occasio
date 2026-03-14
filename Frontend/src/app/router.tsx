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
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers.tsx"));
const AdminPendingManagers = lazy(() => import("../pages/admin/AdminPendingManagers.tsx"));
const AdminEventManagers = lazy(() => import("../pages/admin/AdminEventManagers.tsx"));

const EventManagerLayout = lazy(() => import("../layouts/EventManagerLayout.tsx"));
const EventManagerDashboard = lazy(() => import("../pages/eventManager/EventManagerDashboard.tsx"));
const EventManagerPlaceholder = lazy(() => import("../pages/eventManager/EventManagerPlaceholder.tsx"));

// New Personal Dashboard Pages
const Profile = lazy(() => import("../pages/user/Profile.tsx"));
const UserBookings = lazy(() => import("../pages/user/UserBookings.tsx"));
const SavedEvents = lazy(() => import("../pages/user/SavedEvents.tsx"));
const Settings = lazy(() => import("../pages/user/Settings.tsx"));
const BecomeAManager = lazy(() => import("../pages/user/BecomeAManager.tsx"));


import ManagerGuard from "../components/common/ManagerGuard.tsx";

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
    path: "/applyasmanager",
    element: <BecomeAManager />
  },


  {
    path: "/admin",
    element: (

      <AdminLayout />



    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "events", element: <AdminPlaceholder /> },
      { path: "users", element: <AdminUsers /> },
      { path: "eventmanagers", element: <AdminEventManagers /> },
      { path: "pendingmanagers", element: <AdminPendingManagers /> },
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
      { index: true, element: <Profile /> },
      { path: "profile", element: <Profile /> },
      { path: "user-bookings", element: <UserBookings /> },
      { path: "saved-events", element: <SavedEvents /> },
      { path: "settings", element: <Settings /> },
      { path: "stats", element: <ManagerGuard><EventManagerDashboard /></ManagerGuard> },
      { path: "create-event", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
      { path: "my-events", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
      { path: "bookings", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
      { path: "wallet", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
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