import { PaginationParams, PaginatedResponse } from '@/common/interfaces/pagination.interface';
import { Events } from '@/domain/entities/event.entity';

export interface IGetEventsUseCase {
  execute(params: PaginationParams): Promise<PaginatedResponse<Events> | null>;
}
