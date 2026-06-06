import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export const userService = {
  updateProfile: (name: string) => api.patch(API_ENDPOINTS.USER_PROFILE, { name }),
  upgradeRole: (payload: any) => api.post(API_ENDPOINTS.USER_UPGRADE_ROLE, payload),
  reapply: () => api.patch(API_ENDPOINTS.USER_REAPPLY),
};
