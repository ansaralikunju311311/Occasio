import { api } from './api';

export const authService = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  adminLogin: (data: any) => api.post('/auth/admin/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  resendOtp: (email: string) => api.post('/auth/resend-otp', { email }),
  verifyOtp: (data: any) => api.post('/auth/verify-otp', data),
  me: () => api.get('/auth/me'),
  updatePassword: (data: any) => api.post('/auth/updatepassword', data),
};
