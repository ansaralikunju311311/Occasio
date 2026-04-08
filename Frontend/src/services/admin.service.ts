import { api } from './api';

export const adminService = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserDetails: (id: string) => api.get(`/admin/userDetails/${id}`),
  getPendingManagerDetails: (id: string) => api.get(`/admin/pendingmanagers/${id}`),
  getManagerDetails: (id: string) => api.get(`/admin/managerDetails/${id}`),
  blockUnblockUser: (id: string, status: boolean) => api.patch(`/admin/blockorunblock/${id}`, { status }),
  approveManager: (id: string) => api.patch(`/admin/approval/${id}`),
  rejectManager: (id: string, reason: string) => api.patch(`/admin/rejection/${id}`, { reason }),
};
