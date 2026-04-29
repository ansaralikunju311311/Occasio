import { IGetAllPaymentsUseCase } from './getAllPayments.usecase.interface';
import { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import { PaginatedResponse, PaginationParams } from '../../../../common/interfaces/pagination.interface';

export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<any>> {
    return await this.paymentRepository.getAllPayments(params);
  }
}
