import { Events } from '../../domain/entities/event.entity';
import { EventResponseDto } from '../../application/dtos/responses/event-response.dto';
import { userMapper } from './user.mapper';
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
      creatorDetails: entity.creatorDetails ? userMapper.toResponse(entity.creatorDetails) : undefined,
      seatLayoutId: entity.seatLayoutId,
      SeatLayout: entity.SeatLayout ? this.mapSeatLayout(entity.SeatLayout) : undefined,
      seats: entity.seats ? entity.seats.map(s => this.mapSeat(s)) : undefined,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
    };
  }

  private mapSeat(seat: any) {
    return {
      id: this.mapId(seat._id || seat.id),
      block: seat.block,
      row: seat.row,
      column: seat.column,
      seatNumber: seat.seatNumber,
      categoryName: seat.categoryName,
      price: seat.price,
      status: seat.status,
      holdExpiresAt: seat.holdExpiresAt,
    };
  }

  private mapSeatLayout(layout: any) {
    return {
      id: this.mapId(layout._id || layout.id),
      blocks: layout.blocks?.map((block: any) => ({
        blockName: block.blockName,
        rows: block.rows?.map((row: any) => ({
          rowNumber: row.rowNumber,
          columns: row.columns,
        })),
        category: {
          name: block.category?.name,
          price: block.category?.price,
        },
      })),
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
