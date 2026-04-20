import { EventDto } from '../../../dtos/event.dto';
import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export interface IEventCreationUseCase {
  execute(data: EventDto, userId: string): Promise<EventResponseDto | null>;
}
