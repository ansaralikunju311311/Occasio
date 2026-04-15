import { IEventRepository } from '@/domain/repositories/event/event.repository.interface';
import { IDeleteEventUseCase } from './deleteevent.usecase.interface';

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<boolean> {
    const event = await this.eventRepository.findByIdEvents(id);
    if (!event) return false;

    if (new Date(event.startTime) <= new Date()) {
      throw new Error('Event has already started and cannot be deleted.');
    }

    return await this.eventRepository.deleteEvent(id);
  }
}
