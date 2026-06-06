import { api } from './api';
import { API_ENDPOINTS } from '../constants';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const paymentService = {
  createOrder: async (eventId: string) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_ORDER, { eventId });
    return response.data;
  },
  createTicketOrder: async (eventId: string, amount: number, selectedSeats?: string[], bookingType?: string) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_TICKET_ORDER, { eventId, amount, selectedSeats, bookingType });
    return response.data;
  },
  getPriceBreakdown: async (eventId: string, amount: number) => {
    const response = await api.get(`${API_ENDPOINTS.PAYMENTS_PRICE_BREAKDOWN}?eventId=${eventId}&amount=${amount}`);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get(API_ENDPOINTS.PAYMENTS_MY_BOOKINGS);
    return response.data;
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    eventId: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_VERIFY, paymentData);
    return response.data;
  },

  createSubscriptionOrder: async (planId: string) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_SUBSCRIPTION_ORDER, { planId });
    return response.data;
  },

  verifySubscriptionPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_VERIFY_SUBSCRIPTION, paymentData);
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
        name: 'User Name',
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

  openRazorpaySubscriptionCheckout: (orderData: any, planId: string, onSuccess: () => void, onError: (err: any) => void) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Occasio',
      description: 'Subscription Plan Upgrade',
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          await paymentService.verifySubscriptionPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId,
          });
          onSuccess();
        } catch (err) {
          onError(err);
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
      },
      theme: {
        color: '#6366f1', // Indigo 500
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
