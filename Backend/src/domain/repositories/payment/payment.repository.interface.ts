import { Payment } from '../../entities/payment.entity';

export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Payment>;
}
