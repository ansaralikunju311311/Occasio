import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IGetEventsUseCase } from './getEvents.usecase.interface';
import { PaginationParams, PaginatedResponse } from '@/common/interfaces/pagination.interface';
import { Events } from '@/domain/entities/event.entity';

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}
  async execute(params: PaginationParams): Promise<PaginatedResponse<Events> | null> {
    const result = await this.eventRepository.findAllEvents(params);
    return result;
  }
}
