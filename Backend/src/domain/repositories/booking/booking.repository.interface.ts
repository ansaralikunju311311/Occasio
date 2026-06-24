import type { Booking } from '../../../domain/entities/booking.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

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
}
