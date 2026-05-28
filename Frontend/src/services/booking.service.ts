import { api } from './api';

export const bookingService = {
  lockSeats: async (eventId: string, seatIds: string[]) => {
    const response = await api.post('/bookings/lock-seats', { eventId, seatIds });
    return response.data;
  },

  createPaymentIntent: async (eventId: string, amount: number) => {
    const response = await api.post('/bookings/payment-intent', { eventId, amount });
    return response.data;
  },

  confirmBooking: async (
    eventId: string,
    seatIds: string[],
    paymentId: string,
    totalAmount: number,
    bookingType: 'physical' | 'online'
  ) => {
    const response = await api.post('/bookings/confirm', {
      eventId,
      seatIds,
      paymentId,
      totalAmount,
      bookingType,
    });
    return response.data;
  },

  failBooking: async (seatIds: string[]) => {
    const response = await api.post('/bookings/failed', { seatIds });
    return response.data;
  },
};
