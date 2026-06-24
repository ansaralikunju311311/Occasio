import type { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import type {
  PaginatedResponse,
  PaginationParams,
} from '../../../../common/interfaces/pagination.interface';

import type { IGetAllPaymentsUseCase } from './getAllPayments.usecase.interface';

export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
  constructor(private _paymentRepository: IPaymentRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<unknown>> {
    return await this._paymentRepository.getAllPayments(params);
  }
}
