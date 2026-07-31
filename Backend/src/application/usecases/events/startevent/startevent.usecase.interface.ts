import type { EventResponseDto } from '../../../dtos/responses/event-response.dto';

export interface IStartEventUseCase {
  execute(eventId: string, managerId: string): Promise<EventResponseDto>;
}
