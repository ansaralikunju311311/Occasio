import type { UpdateEventDTO } from '../../../../application/dtos/updateevent.dto';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';

export interface IUpdateEventUseCase {
  execute(
    eventId: string,
    managerId: string,
    data: UpdateEventDTO,
  ): Promise<EventResponseDto | null>;
}
