import { api } from './api';
import { API_ENDPOINTS } from '../constants';

export interface RazorpayOrderData {
  id: string;
  amount: number;
  currency: string;
}

export interface RazorpayResponsePayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorPayload {
  message?: string;
  code?: string;
  description?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: string, handler: (resp: { error: RazorpayErrorPayload }) => void): void;
    };
  }
}

export const paymentService = {
  createOrder: async (eventId: string) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_ORDER, { eventId });
    return response.data;
  },
  createTicketOrder: async (
    eventId: string,
    amount: number,
    selectedSeats?: string[],
    bookingType?: string
  ) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_TICKET_ORDER, {
      eventId,
      amount,
      selectedSeats,
      bookingType,
    });
    return response.data;
  },
  walletPay: async (payload: {
    eventId: string;
    amount: number;
    selectedSeats?: string[];
    bookingType?: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_WALLET_PAY, payload);
    return response.data;
  },
  getPriceBreakdown: async (eventId: string, amount: number) => {
    const response = await api.get(
      `${API_ENDPOINTS.PAYMENTS_PRICE_BREAKDOWN}?eventId=${eventId}&amount=${amount}`
    );
    return response.data;
  },
  getMyBookings: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(
      `${API_ENDPOINTS.PAYMENTS_MY_BOOKINGS}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getManagerBookings: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(
      `${API_ENDPOINTS.PAYMENTS_MANAGER_BOOKINGS}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getWalletHistory: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(
      `${API_ENDPOINTS.PAYMENTS_WALLET_HISTORY}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  verifyPayment: async (paymentData: RazorpayResponsePayload & { eventId: string }) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_VERIFY, paymentData);
    return response.data;
  },

  createSubscriptionOrder: async (planId: string) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_SUBSCRIPTION_ORDER, { planId });
    return response.data;
  },

  verifySubscriptionPayment: async (paymentData: RazorpayResponsePayload & { planId: string }) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS_VERIFY_SUBSCRIPTION, paymentData);
    return response.data;
  },

  openRazorpayCheckout: (
    orderData: RazorpayOrderData,
    eventId: string,
    onSuccess: () => void,
    onError: (err: unknown) => void
  ) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Occasio',
      description: 'Event Scheduling Fee',
      order_id: orderData.id,
      handler: async (response: RazorpayResponsePayload) => {
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
    rzp.on('payment.failed', function (response: { error: RazorpayErrorPayload }) {
      onError(response.error);
    });
    rzp.open();
  },

  openRazorpaySubscriptionCheckout: (
    orderData: RazorpayOrderData,
    planId: string,
    onSuccess: () => void,
    onError: (err: unknown) => void
  ) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Occasio',
      description: 'Subscription Plan Upgrade',
      order_id: orderData.id,
      handler: async (response: RazorpayResponsePayload) => {
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
    rzp.on('payment.failed', function (response: { error: RazorpayErrorPayload }) {
      onError(response.error);
    });
    rzp.open();
  },
};
