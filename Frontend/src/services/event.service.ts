import { api } from './api';
import { API_ENDPOINTS } from '../constants';
import type { EventFilterParams, EventItem } from '../types/event.types';

export interface CreateEventPayload {
  title: string;
  description: string;
  picture: string;
  eventType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startTime: string | Date;
  endTime: string | Date;
  price?: number;
  isSeatLayoutEnabled?: boolean;
  maxOnlineUsers?: number;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  } | null;
  layout?: Record<string, unknown>;
}

export const eventService = {
  getEvents: (params?: EventFilterParams) => api.get(API_ENDPOINTS.EVENTS, { params }),
  getEventDetails: (id: string) => api.get(API_ENDPOINTS.EVENT_DETAILS(id)),
  createEvent: (payload: CreateEventPayload) => api.post(API_ENDPOINTS.EVENT_CREATION, payload),
  getAllEvents: (params?: EventFilterParams) => api.get(API_ENDPOINTS.EVENTS_ALL, { params }),
  getMyEvents: (params?: EventFilterParams) => api.get(API_ENDPOINTS.EVENTS_MY, { params }),
  updateEvent: (id: string, payload: Partial<CreateEventPayload> | Partial<EventItem>) => api.put(API_ENDPOINTS.EVENT_UPDATE(id), payload),
  deleteEvent: (id: string) => api.delete(API_ENDPOINTS.EVENT_DELETE(id)),
  startEvent: (id: string) => api.patch(API_ENDPOINTS.EVENT_START(id)),
  getManagerStats: () => api.get(API_ENDPOINTS.EVENTS_MANAGER_STATS),
};
