import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IMyEventsUseCase } from './myevents.usecase.interface';
import { PaginationParams, PaginatedResponse } from '@/common/interfaces/pagination.interface';
import { Events } from '@/domain/entities/event.entity';

export class MyEventsUseCase implements IMyEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(userId: string, params: PaginationParams): Promise<PaginatedResponse<Events> | null> {
    const result = await this.eventRepository.findEvents(userId, params);
    return result;
  }
}
