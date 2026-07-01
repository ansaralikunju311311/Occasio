import type { PaginatedResponse } from '../../../../common/interfaces/pagination.interface';
import type { PaymentResponseDto } from '../../../../application/dtos/responses/payment-response.dto';

export interface IGetWalletHistoryUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PaymentResponseDto>>;
}
