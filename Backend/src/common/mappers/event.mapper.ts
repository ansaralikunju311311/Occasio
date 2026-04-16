import { Events } from '../../domain/entities/event.entity';
import { EventResponseDto } from '../../application/dtos/responses/event-response.dto';
import { BaseMapper } from './base.mapper';

export class EventMapper extends BaseMapper<Events, EventResponseDto> {
  toResponse(entity: Events): EventResponseDto {
    return {
      id: this.mapId(entity.id),
      title: entity.title,
      description: entity.description,
      eventType: entity.eventType,
      startTime: entity.startTime,
      endTime: entity.endTime,
      location: entity.location ? {
        type: entity.location.type,
        coordinates: entity.location.coordinates,
        address: entity.location.address,
      } : undefined,
      maxOnlineUsers: entity.maxOnlineUsers,
      price: entity.price,
      createdBy: entity.createdBy,
      status: entity.status,
      picture: entity.picture,
      creatorDetails: entity.creatorDetails,
      seatLayoutId: entity.seatLayoutId,
      SeatLayout: entity.SeatLayout,
      seats: entity.seats,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
    };
  }

  
  toSummary(entity: Events) {
    return {
      id: this.mapId(entity.id),
      title: entity.title,
      dateRange: `${entity.startTime.toDateString()} - ${entity.endTime.toDateString()}`,
      venue: entity.location?.address || 'Online',
    };
  }
}

export const eventMapper = new EventMapper();
