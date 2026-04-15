import { UpdateEventDTO } from '@/application/dtos/updateevent.dto';
import { Events } from '@/domain/entities/event.entity';


export interface IUpdateEventUseCase {
  execute(eventId: string, managerId: string, data: UpdateEventDTO): Promise<Events | null>;
}
