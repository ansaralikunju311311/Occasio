import type { Payment } from '../../entities/payment.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Payment>;
  getAllPayments(
    params: PaginationParams,
  ): Promise<PaginatedResponse<Payment>>;
  findPaymentByBookingId(bookingId: string): Promise<Payment | null>;
  getWalletHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Payment>>;
}
