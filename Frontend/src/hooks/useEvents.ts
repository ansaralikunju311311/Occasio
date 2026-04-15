import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/event.service';

export const useEvents = (params?: any) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getEvents(params).then((res) => res.data),
  });
};

export const useEventDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventDetails(id!).then((res) => res.data.events),
    enabled: !!id,
  });
};

export const useEventSeats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['eventSeats', id],
    queryFn: () => eventService.getEventDetails(id!).then((res) => res.data.events),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => eventService.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
    },
  });
};

export const useAllEventsAdmin = (params?: any) => {
  return useQuery({
    queryKey: ['allEventsAdmin', params],
    queryFn: () => eventService.getAllEvents(params).then((res) => res.data),
  });
};

export const useMyEvents = (params?: any) => {
  return useQuery({
    queryKey: ['myEvents', params],
    queryFn: () => eventService.getMyEvents(params).then((res) => res.data),
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      eventService.updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
    },
  });
};
