import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';

export const useAdminUsers = (params?: any) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => adminService.getUsers(params).then((res) => res.data),
  });
};

export const usePendingManagers = (params?: any) => {
  return useQuery({
    queryKey: ['pendingManagers', params],
    queryFn: () => adminService.getUsers(params).then((res) => {
      const usersData: any[] = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];
      return usersData.filter((user: any) => user.applyingupgrade === 'PENDING');
    }),
  });
};

export const useAdminUserDetails = (id: string) => {
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: () => adminService.getUserDetails(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useAdminPendingManagerDetails = (id: string) => {
  return useQuery({
    queryKey: ['adminPendingManager', id],
    queryFn: () => adminService.getPendingManagerDetails(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useEventManagers = (params?: any) => {
  return useQuery({
    queryKey: ['adminManagers', params],
    queryFn: () => adminService.getUsers(params).then((res) => {
      const usersData: any[] = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];
      return usersData.filter(
        (user: any) => user.role === 'EVENT_MANAGER' || user.isEventManger === true
      );
    }),
  });
};

export const useAllUsers = (params?: any) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => adminService.getUsers(params).then((res) => {
      const usersData: any[] = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];
      return usersData.filter((user: any) => user.role === 'USER');
    }),
  });
};

export const useAdminManagerDetails = (id: string, email?: string) => {
  return useQuery({
    queryKey: ['adminManager', id],
    queryFn: () => adminService.getManagerDetails(id).then((res) => ({ ...res.data, authEmail: email })),
    enabled: !!id,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.blockUnblockUser(id, status === 'ACTIVE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminManagers'] });
      queryClient.invalidateQueries({ queryKey: ['pendingManagers'] });
    },
  });
};

export const useApproveManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.approveManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['pendingManagers'] });
    },
  });
};

export const useRejectManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.rejectManager(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['pendingManagers'] });
    },
  });
};
