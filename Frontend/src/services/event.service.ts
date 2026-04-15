import { api } from './api';

export const eventService = {
  getEvents: (params?: any) => api.get('/events/events', { params }),
  getEventDetails: (id: string) => api.get(`/events/eventDetails/${id}`),
  createEvent: (payload: any) => api.post('/events/creation', payload),
  getAllEvents: (params?: any) => api.get('/events/allevents', { params }),
  getMyEvents: (params?: any) => api.get('/events/myevents', { params }),
  updateEvent: (id: string, payload: any) => api.put(`/events/update/${id}`, payload),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
};
