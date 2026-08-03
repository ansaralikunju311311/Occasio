import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export interface SignupDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  token?: string;
  email?: string;
  newPassword?: string;
  password?: string;
}

export interface UpdatePasswordDto {
  email?: string;
  currentPassword?: string;
  oldPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}

export const authService = {
  signup: (data: SignupDto) => api.post(API_ENDPOINTS.AUTH_SIGNUP, data),
  login: (data: LoginDto) => api.post(API_ENDPOINTS.AUTH_LOGIN, data),
  adminLogin: (data: LoginDto) => api.post(API_ENDPOINTS.AUTH_ADMIN_LOGIN, data),
  logout: () => api.post(API_ENDPOINTS.AUTH_LOGOUT),
  forgotPassword: (email: string) => api.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email }),
  resetPassword: (data: ResetPasswordDto) => api.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, data),
  resendOtp: (email: string) => api.post(API_ENDPOINTS.AUTH_RESEND_OTP, { email }),
  verifyOtp: (data: VerifyOtpDto) => api.post(API_ENDPOINTS.AUTH_VERIFY_OTP, data),
  me: () => api.get(API_ENDPOINTS.AUTH_ME),
  updatePassword: (data: UpdatePasswordDto) => api.post(API_ENDPOINTS.AUTH_UPDATE_PASSWORD, data),
};
