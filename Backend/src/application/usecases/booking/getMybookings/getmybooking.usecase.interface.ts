import type { PaginatedResponse } from '../../../../common/interfaces/pagination.interface';

export interface IGetMyBookingUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<unknown>>;
}
