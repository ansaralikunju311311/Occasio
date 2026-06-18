import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { API_ENDPOINTS } from '../constants';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* REQUEST INTERCEPTOR */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const authEndpoints = [
      API_ENDPOINTS.AUTH_LOGIN,
      API_ENDPOINTS.AUTH_VERIFY_OTP,
      API_ENDPOINTS.AUTH_SIGNUP,
      API_ENDPOINTS.AUTH_RESEND_OTP,
      API_ENDPOINTS.AUTH_FORGOT_PASSWORD,
      API_ENDPOINTS.AUTH_RESET_PASSWORD,
      API_ENDPOINTS.AUTH_ADMIN_LOGIN,
      API_ENDPOINTS.AUTH_REFRESH,
      API_ENDPOINTS.AUTH_LOGOUT,
    ];

    const isAuthRequest = authEndpoints.some((endpoint) => originalRequest.url?.includes(endpoint));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Access token expired → trying refresh');
        const res = await api.post(API_ENDPOINTS.AUTH_REFRESH);
        const newAccessToken = res.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        console.log('New access token received → retrying original request');
        return api(originalRequest);
      } catch (refreshError) {
        console.log('Refresh token failed → logging out');
        processQueue(refreshError, null);

        localStorage.removeItem('accessToken');
        store.dispatch(logout());

        const skipRedirectPages = [
          '/',
          '/login',
          '/adminlogin',
          '/signup',
          '/otpverification',
          '/forgotpassword',
          '/resetpassword',
        ];

        const currentPath = window.location.pathname;
        if (!skipRedirectPages.includes(currentPath)) {
          if (currentPath.startsWith('/admin')) {
            window.location.href = '/adminlogin';
          } else {
            window.location.href = '/login';
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
