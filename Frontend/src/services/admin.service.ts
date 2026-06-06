import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export const adminService = {
  getUsers: (params?: any) => api.get(API_ENDPOINTS.ADMIN_USERS, { params }),
  getUserDetails: (id: string) => api.get(API_ENDPOINTS.ADMIN_USER_DETAILS(id)),
  getPendingManagerDetails: (id: string) => api.get(API_ENDPOINTS.ADMIN_PENDING_MANAGERS(id)),
  getManagerDetails: (id: string) => api.get(API_ENDPOINTS.ADMIN_MANAGER_DETAILS(id)),
  blockUnblockUser: (id: string, status: string) => api.patch(API_ENDPOINTS.ADMIN_BLOCK_UNBLOCK(id), { status }),
  approveManager: (id: string) => api.patch(API_ENDPOINTS.ADMIN_APPROVE_MANAGER(id)),
  rejectManager: (id: string, reason: string) => api.patch(API_ENDPOINTS.ADMIN_REJECT_MANAGER(id), { reason }),
  
  // Subscription Plans
  getPlans: () => api.get(API_ENDPOINTS.PLANS_GET),
  createPlan: (data: any) => api.post(API_ENDPOINTS.PLANS_CREATE, data),
  updatePlan: (id: string, data: any) => api.patch(API_ENDPOINTS.PLANS_UPDATE(id), data),

  // Payments
  getPaymentHistory: (params?: any) => api.get(API_ENDPOINTS.ADMIN_PAYMENTS, { params }),
};
