import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export interface AdminUserParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  applyingupgrade?: boolean;
}

export interface PlanPayload {
  name: string;
  price: number;
  eventLimit: number;
  commissionPercentage: number;
  features?: string[];
  isActive?: boolean;
}

export const adminService = {
  getUsers: (params?: AdminUserParams) => api.get(API_ENDPOINTS.ADMIN_USERS, { params }),
  getUserDetails: (id: string) => api.get(API_ENDPOINTS.ADMIN_USER_DETAILS(id)),
  getPendingManagerDetails: (id: string) => api.get(API_ENDPOINTS.ADMIN_PENDING_MANAGERS(id)),
  getManagerDetails: (id: string) => api.get(API_ENDPOINTS.ADMIN_MANAGER_DETAILS(id)),
  blockUnblockUser: (id: string, status: string) =>
    api.patch(API_ENDPOINTS.ADMIN_BLOCK_UNBLOCK(id), { status }),
  approveManager: (id: string) => api.patch(API_ENDPOINTS.ADMIN_APPROVE_MANAGER(id)),
  rejectManager: (id: string, reason: string) =>
    api.patch(API_ENDPOINTS.ADMIN_REJECT_MANAGER(id), { reason }),

  getPlans: (params?: Record<string, unknown>) => api.get(API_ENDPOINTS.PLANS_GET, { params }),
  createPlan: (data: PlanPayload) => api.post(API_ENDPOINTS.PLANS_CREATE, data),
  updatePlan: (id: string, data: Partial<PlanPayload>) => api.patch(API_ENDPOINTS.PLANS_UPDATE(id), data),

  // Payments
  getPaymentHistory: (params?: Record<string, unknown>) => api.get(API_ENDPOINTS.ADMIN_PAYMENTS, { params }),
  getDashboardStats: () => api.get(API_ENDPOINTS.ADMIN_DASHBOARD_STATS),
};
