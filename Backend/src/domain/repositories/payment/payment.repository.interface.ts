import { Payment } from '../../entities/payment.entity';
import { PaginationParams, PaginatedResponse } from '../../../common/interfaces/pagination.interface';


export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Payment>;
  getAllPayments(params: PaginationParams): Promise<PaginatedResponse<any>>;
}
