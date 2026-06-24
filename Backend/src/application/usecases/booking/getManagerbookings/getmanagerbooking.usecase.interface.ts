import type { PaginatedResponse } from '../../../../common/interfaces/pagination.interface';

export interface IGetManagerBookingUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<unknown>>;
}
