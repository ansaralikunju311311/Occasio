import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export interface UpgradeRolePayload {
  email?: string;
  fullName: string;
  organizationName: string;
  aboutEvents: string;
  certificate?: string;
  documentReference?: string;
  experienceLevel: string;
  socialLinks?: string;
  organizationType: string;
}

export const userService = {
  updateProfile: (name: string) => api.patch(API_ENDPOINTS.USER_PROFILE, { name }),
  upgradeRole: (payload: UpgradeRolePayload) => api.post(API_ENDPOINTS.USER_UPGRADE_ROLE, payload),
  reapply: () => api.patch(API_ENDPOINTS.USER_REAPPLY),
};
