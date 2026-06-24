import type {
  PaginatedResponse,
  PaginationParams,
} from '../../../../common/interfaces/pagination.interface';
import type { PaymentResponseDto } from '../../../../application/dtos/responses/payment-response.dto';

export interface IGetAllPaymentsUseCase {
  execute(
    params: PaginationParams,
  ): Promise<PaginatedResponse<PaymentResponseDto>>;
}
