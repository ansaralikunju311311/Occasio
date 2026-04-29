import { PaginatedResponse, PaginationParams } from '../../../../common/interfaces/pagination.interface';

export interface IGetAllPaymentsUseCase {
  execute(params: PaginationParams): Promise<PaginatedResponse<any>>;
}
