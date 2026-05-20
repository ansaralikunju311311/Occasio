import { api } from './api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const paymentService = {
  createOrder: async (eventId: string) => {
    const response = await api.post('/payments/order', { eventId });
    return response.data;
  },
  createTicketOrder: async (eventId: string, amount: number, selectedSeats?: string[], bookingType?: string) => {
    const response = await api.post('/payments/ticket-order', { eventId, amount, selectedSeats, bookingType });
    return response.data;
  },
  getPriceBreakdown: async (eventId: string, amount: number) => {
    const response = await api.get(`/payments/price-breakdown?eventId=${eventId}&amount=${amount}`);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get('/payments/my-bookings');
    return response.data;
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    eventId: string;
  }) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },

  openRazorpayCheckout: (orderData: any, eventId: string, onSuccess: () => void, onError: (err: any) => void) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Occasio',
      description: 'Event Scheduling Fee',
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            eventId,
          });
          onSuccess();
        } catch (err) {
          onError(err);
        }
      },
      prefill: {
        name: 'User Name', // Can be dynamic
        email: 'user@example.com',
      },
      theme: {
        color: '#14b8a6', // Teal 500
      },
      modal: {
        ondismiss: function () {
          onError({ message: 'Payment cancelled by user' });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      onError(response.error);
    });
    rzp.open();
  },
};
