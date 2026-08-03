import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminUserParams, type PlanPayload } from '../services/admin.service';

export const useAdminUsers = (params?: AdminUserParams) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => adminService.getUsers(params).then((res) => res.data),
  });
};

export const usePendingManagers = (params?: AdminUserParams) => {
  return useQuery({
    queryKey: ['pendingManagers', params],
    queryFn: () =>
      adminService.getUsers({ ...params, applyingupgrade: true }).then((res) => res.data),
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

export const useEventManagers = (params?: AdminUserParams) => {
  return useQuery({
    queryKey: ['adminManagers', params],
    queryFn: () =>
      adminService.getUsers({ ...params, role: 'EVENT_MANAGER' }).then((res) => res.data),
  });
};

export const useAllUsers = (params?: AdminUserParams) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => adminService.getUsers({ ...params, role: 'USER' }).then((res) => res.data),
  });
};

export const useAdminManagerDetails = (id: string, email?: string) => {
  return useQuery({
    queryKey: ['adminManager', id],
    queryFn: () =>
      adminService.getManagerDetails(id).then((res) => ({ ...res.data, authEmail: email })),
    enabled: !!id,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.blockUnblockUser(id, status),
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
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectManager(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['pendingManagers'] });
    },
  });
};

export const usePlans = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['adminPlans', params],
    queryFn: () => adminService.getPlans(params).then((res) => res.data),
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlanPayload) => adminService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlanPayload> }) =>
      adminService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
    },
  });
};

export const usePaymentHistory = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['adminPayments', params],
    queryFn: () => adminService.getPaymentHistory(params).then((res) => res.data),
  });
};

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => adminService.getDashboardStats().then((res) => res.data),
  });
};
