import type { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import type { PaginatedResponse } from '../../../../common/interfaces/pagination.interface';
import type { PaymentResponseDto } from '../../../../application/dtos/responses/payment-response.dto';
import { paymentMapper } from '../../../../common/mappers/payment.mapper';

import type { IGetWalletHistoryUseCase } from './getWalletHistory.usecase.interface';

export class GetWalletHistoryUseCase implements IGetWalletHistoryUseCase {
  constructor(private _paymentRepository: IPaymentRepository) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PaymentResponseDto>> {
    const result = await this._paymentRepository.getWalletHistory(userId, page, limit);
    return {
      data: paymentMapper.toResponseArray(result.data),
      metadata: result.metadata,
    };
  }
}
