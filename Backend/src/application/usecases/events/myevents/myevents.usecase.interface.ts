import { PaginationParams, PaginatedResponse } from '@/common/interfaces/pagination.interface';
import { Events } from '@/domain/entities/event.entity';

export interface IMyEventsUseCase {
  execute(userId: string, params: PaginationParams): Promise<PaginatedResponse<Events> | null>;
}
