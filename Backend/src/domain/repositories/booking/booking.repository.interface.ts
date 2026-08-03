import type { Booking } from '../../../domain/entities/booking.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

export interface RefundInfoResult {
  eligible: boolean;
  refundPercentage: number;
  refundAmount: number;
  totalAmount: number;
  message: string;
}

export interface IBookingRepository {
  saveBooking(booking: Booking): Promise<Booking>;
  findBookingById(id: string): Promise<Booking | null>;
  findBookingByPaymentId(paymentId: string): Promise<Booking | null>;
  updateBookingStatus(id: string, status: string): Promise<Booking | null>;
  getBookingsByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Booking>>;
  getBookingsByEvent(
    eventId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Booking>>;
  getManagerBookings(
    managerId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Booking>>;
  getOnlineBookedCount(eventId: string): Promise<number>;
  findConfirmedBookingsByEventId(eventId: string): Promise<Booking[]>;
  hasBookings(eventId: string): Promise<boolean>;
  getRefundInfo(bookingId: string, userId: string): Promise<RefundInfoResult>;
}
