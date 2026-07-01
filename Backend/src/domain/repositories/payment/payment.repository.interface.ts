import type { Payment } from '../../entities/payment.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import type { PaymentResponseDto } from '../../../application/dtos/responses/payment-response.dto';

export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Payment>;
  getAllPayments(
    params: PaginationParams,
  ): Promise<PaginatedResponse<PaymentResponseDto>>;
  findPaymentByBookingId(bookingId: string): Promise<Payment | null>;
  getWalletHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PaymentResponseDto>>;
}
