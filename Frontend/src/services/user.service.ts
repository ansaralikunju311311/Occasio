import { api } from './api';

export const userService = {
  updateProfile: (name: string) => api.patch('/user/profile', { name }),
  upgradeRole: (payload: any) => api.post('/user/upgraderole', payload),
  reapply: () => api.patch('/user/reapply'),
};
