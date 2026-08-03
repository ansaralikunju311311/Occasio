import type { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import type {
  PaginatedResponse,
  PaginationParams,
} from '../../../../common/interfaces/pagination.interface';
import type { PaymentResponseDto } from '../../../../application/dtos/responses/payment-response.dto';
import { paymentMapper } from '../../../../common/mappers/payment.mapper';

import type { IGetAllPaymentsUseCase } from './getAllPayments.usecase.interface';

export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
  constructor(private _paymentRepository: IPaymentRepository) {}

  async execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<PaymentResponseDto>> {
    const result = await this._paymentRepository.getAllPayments(params);
    return {
      data: paymentMapper.toResponseArray(result.data),
      metadata: result.metadata,
    };
  }
}
