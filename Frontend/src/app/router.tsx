import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
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
const AdminEvents = lazy(() => import("../pages/admin/AdminEvents.tsx"));
const AdminPendingManagers = lazy(() => import("../pages/admin/AdminPendingManagers.tsx"));
const AdminEventManagers = lazy(() => import("../pages/admin/AdminEventManagers.tsx"));

const EventManagerLayout = lazy(() => import("../layouts/EventManagerLayout.tsx"));
const EventManagerDashboard = lazy(() => import("../pages/eventManager/EventManagerDashboard.tsx"));
const EventManagerPlaceholder = lazy(() => import("../pages/eventManager/EventManagerPlaceholder.tsx"));
const CreateEvent = lazy(() => import("../pages/eventManager/CreateEvent.tsx"));

// New Personal Dashboard Pages
const Profile = lazy(() => import("../pages/user/Profile.tsx"));
const UserBookings = lazy(() => import("../pages/user/UserBookings.tsx"));
const SavedEvents = lazy(() => import("../pages/user/SavedEvents.tsx"));
const Settings = lazy(() => import("../pages/user/Settings.tsx"));
const BecomeAManager = lazy(() => import("../pages/user/BecomeAManager.tsx"));


import ManagerGuard from "../components/common/ManagerGuard.tsx";
import ProtectedRoute from "../components/common/ProtectedRoute.tsx";
import PublicRoute from "../components/common/PublicRoute.tsx";
import PreventAdminRoute from "../components/common/PreventAdminRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PreventAdminRoute>
        <MainLayout />
      </PreventAdminRoute>
    ),
    children: [
      { index: true, element: <LandingPage /> },

    ],
  },

  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },

  {
    path: "/signup",
    element: <PublicRoute><SignPage /></PublicRoute>,
  },


  {
    path: "/otpverification",
    element: <PublicRoute><OtpVerification /></PublicRoute>
  },

  {
    path: "/forgotpassword",
    element: <PublicRoute><ForgotPassword /></PublicRoute>
  },

  {
    path: "/resetpassword",
    element: <PublicRoute><ResetPassword /></PublicRoute>
  },
  {
    path: "/oauth-success",
    element: <OAuthSuccess />
  },
  {
    path: "/applyasmanager",
    element: <ProtectedRoute><BecomeAManager /></ProtectedRoute>
  },


  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "events", element: <AdminEvents /> },
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
      <ProtectedRoute allowedRoles={["USER", "EVENT_MANAGER"]}>
        <EventManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Profile /> },
      { path: "profile", element: <Profile /> },
      { path: "user-bookings", element: <UserBookings /> },
      { path: "saved-events", element: <SavedEvents /> },
      { path: "settings", element: <Settings /> },
      { path: "stats", element: <ManagerGuard><EventManagerDashboard /></ManagerGuard> },
      { path: "create-event", element: <ManagerGuard><CreateEvent /></ManagerGuard> },
      { path: "my-events", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
      { path: "bookings", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
      { path: "wallet", element: <ManagerGuard><EventManagerPlaceholder /></ManagerGuard> },
    ]
  },

  {
    path: "/adminlogin",
    element: <PublicRoute><AdminLogin /></PublicRoute>
  }

]);






export const RouterWrapper = () => {
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);

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
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};