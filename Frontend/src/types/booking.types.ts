import type { EventItem } from './event.types';

export interface UserBookingItem {
  id: string;
  _id?: string;
  userId: string | { _id?: string; name?: string; email?: string };
  eventId: string | EventItem;
  seats: string[];
  bookingType: 'physical' | 'online';
  totalAmount: number;
  commissionAmount: number;
  organizerRevenue: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  paymentId?: string;
  qrCodeData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface RazorpayOrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
    [key: string]: unknown;
  };
}

export interface RefundInfo {
  refundPercentage: number;
  refundAmount: number;
  canCancel: boolean;
  message?: string;
}
