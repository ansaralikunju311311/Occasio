import { EventDto } from '../../../dtos/event.dto';

export interface IEventCreationUseCase {
  execute(data: EventDto, userId: string): Promise<any>;
}
