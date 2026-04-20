import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export interface IEventDetailsUseCase {
  execute(id: string): Promise<EventResponseDto | null>;
}
