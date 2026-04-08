import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => userService.updateProfile(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useUpgradeRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => userService.upgradeRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useReapply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userService.reapply(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
