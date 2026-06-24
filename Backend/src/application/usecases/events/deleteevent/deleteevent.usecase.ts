import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';

import type { IDeleteEventUseCase } from './deleteevent.usecase.interface';

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(private _eventRepository: IEventRepository) {}

  async execute(id: string): Promise<boolean> {
    const event = await this._eventRepository.findByIdEvents(id);
    if (!event) {
      return false;
    }

    if (new Date(event.startTime) <= new Date()) {
      throw new Error('Event has already started and cannot be deleted.');
    }

    return await this._eventRepository.deleteEvent(id);
  }
}
