import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  signup: (data: any) => api.post(API_ENDPOINTS.AUTH_SIGNUP, data),
  login: (data: any) => api.post(API_ENDPOINTS.AUTH_LOGIN, data),
  adminLogin: (data: any) => api.post(API_ENDPOINTS.AUTH_ADMIN_LOGIN, data),
  logout: () => api.post(API_ENDPOINTS.AUTH_LOGOUT),
  forgotPassword: (email: string) => api.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email }),
  resetPassword: (data: any) => api.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, data),
  resendOtp: (email: string) => api.post(API_ENDPOINTS.AUTH_RESEND_OTP, { email }),
  verifyOtp: (data: any) => api.post(API_ENDPOINTS.AUTH_VERIFY_OTP, data),
  me: () => api.get(API_ENDPOINTS.AUTH_ME),
  updatePassword: (data: any) => api.post(API_ENDPOINTS.AUTH_UPDATE_PASSWORD, data),
};
