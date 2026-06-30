import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export const eventService = {
  getEvents: (params?: any) => api.get(API_ENDPOINTS.EVENTS, { params }),
  getEventDetails: (id: string) => api.get(API_ENDPOINTS.EVENT_DETAILS(id)),
  createEvent: (payload: any) => api.post(API_ENDPOINTS.EVENT_CREATION, payload),
  getAllEvents: (params?: any) => api.get(API_ENDPOINTS.EVENTS_ALL, { params }),
  getMyEvents: (params?: any) => api.get(API_ENDPOINTS.EVENTS_MY, { params }),
  updateEvent: (id: string, payload: any) => api.put(API_ENDPOINTS.EVENT_UPDATE(id), payload),
  deleteEvent: (id: string) => api.delete(API_ENDPOINTS.EVENT_DELETE(id)),
  getManagerStats: () => api.get(API_ENDPOINTS.EVENTS_MANAGER_STATS),
};

