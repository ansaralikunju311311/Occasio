import type { EventDto } from '../../application/dtos/event.dto';
import type { UpdateEventDTO } from '../../application/dtos/updateevent.dto';
import type { EventType } from '../enums/event-type';

export class EventDtoMapper {
  static fromRequest(body: Record<string, unknown>): EventDto {
    return {
      title: body.title as string,
      description: body.description as string,
      picture: body.picture as string,
      eventType: body.eventType as EventType,
      startTime: new Date(body.startTime as string),
      endTime: new Date(body.endTime as string),
      price: Number(body.price),
      isSeatLayoutEnabled: Boolean(body.isSeatLayoutEnabled),
      maxOnlineUsers:
        body.maxOnlineUsers !== undefined && body.maxOnlineUsers !== null
          ? Number(body.maxOnlineUsers)
          : undefined,
      address: body.address as string | undefined,
      layout: body.layout as EventDto['layout'],
    };
  }

  static toUpdateDto(body: Record<string, unknown>): UpdateEventDTO {
    const dto: UpdateEventDTO = {};
    if (body.title !== undefined) {
      dto.title = body.title as string;
    }
    if (body.description !== undefined) {
      dto.description = body.description as string;
    }
    if (body.picture !== undefined) {
      dto.picture = body.picture as string;
    }
    if (body.eventType !== undefined) {
      dto.eventType = body.eventType as EventType;
    }
    if (body.startTime !== undefined) {
      dto.startTime = new Date(body.startTime as string);
    }
    if (body.endTime !== undefined) {
      dto.endTime = new Date(body.endTime as string);
    }
    if (body.price !== undefined) {
      dto.price = Number(body.price);
    }
    if (body.maxOnlineUsers !== undefined) {
      dto.maxOnlineUsers = Number(body.maxOnlineUsers);
    }
    if (body.location !== undefined) {
      dto.location = body.location as UpdateEventDTO['location'];
    }
    if (body.layout !== undefined) {
      dto.layout = body.layout as UpdateEventDTO['layout'];
    }
    return dto;
  }
}
