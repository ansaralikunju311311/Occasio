import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export const bookingService = {
  lockSeats: async (eventId: string, seatIds: string[]) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS_LOCK_SEATS, { eventId, seatIds });
    return response.data;
  },

  createPaymentIntent: async (eventId: string, amount: number) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS_PAYMENT_INTENT, { eventId, amount });
    return response.data;
  },

  confirmBooking: async (
    eventId: string,
    seatIds: string[],
    paymentId: string,
    totalAmount: number,
    bookingType: 'physical' | 'online'
  ) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS_CONFIRM, {
      eventId,
      seatIds,
      paymentId,
      totalAmount,
      bookingType,
    });
    return response.data;
  },

  failBooking: async (seatIds: string[]) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS_FAILED, { seatIds });
    return response.data;
  },
};
