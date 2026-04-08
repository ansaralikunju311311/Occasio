import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => authService.login(data),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: any) => authService.signup(data),
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (data: any) => authService.adminLogin(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => authService.resetPassword(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendOtp(email),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: any) => authService.verifyOtp(data),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: any) => authService.updatePassword(data),
  });
};

export const useMe = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me().then((res) => res.data),
    enabled,
    retry: false,
  });
};
