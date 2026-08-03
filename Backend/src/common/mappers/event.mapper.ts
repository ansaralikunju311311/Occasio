import type { Events } from '../../domain/entities/event.entity';
import type { EventResponseDto } from '../../application/dtos/responses/event-response.dto';
import type { SeatResponseDto } from '../../application/dtos/responses/seat-response.dto';
import type { SeatLayoutResponseDto } from '../../application/dtos/responses/seat-layout-response.dto';
import type { SeatStatus } from '../../common/enums/searstatus-enum';

import { userMapper } from './user.mapper';
import { BaseMapper } from './base.mapper';

export interface SeatData {
  _id?: string;
  id?: string;
  block?: string;
  row?: number;
  column?: number;
  seatNumber?: string;
  categoryName?: string;
  price?: number;
  status?: SeatStatus | string;
  holdExpiresAt?: Date;
}

export interface SeatLayoutData {
  _id?: string;
  id?: string;
  blocks?: Array<{
    blockName: string;
    rows?: Array<{
      rowNumber: number;
      columns: number;
    }>;
    category?: {
      name?: string;
      price?: number;
    };
  }>;
}

export class EventMapper extends BaseMapper<Events, EventResponseDto> {
  toResponse(entity: Events): EventResponseDto {
    return {
      id: this.mapId(entity.id),
      title: entity.title,
      description: entity.description,
      eventType: entity.eventType,
      startTime: entity.startTime,
      endTime: entity.endTime,
      location: entity.location
        ? {
            type: entity.location.type,
            coordinates: entity.location.coordinates,
            address: entity.location.address,
          }
        : undefined,
      maxOnlineUsers: entity.maxOnlineUsers,
      price: entity.price,
      createdBy: entity.createdBy,
      status: entity.status,
      picture: entity.picture,
      creatorDetails: entity.creatorDetails
        ? userMapper.toResponse(entity.creatorDetails)
        : undefined,
      bookedTickets: entity.bookedTickets,
      seatLayoutId: entity.seatLayoutId,
      SeatLayout: entity.SeatLayout
        ? this.mapSeatLayout(entity.SeatLayout as SeatLayoutData)
        : undefined,
      seats: entity.seats
        ? entity.seats.map((s) => this.mapSeat(s as SeatData))
        : undefined,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      publishedAt: entity.publishedAt,
      hasBookings: entity.hasBookings,
    };
  }

  private mapSeat(seat: SeatData): SeatResponseDto {
    return {
      id: this.mapId(seat._id || seat.id || null),
      block: seat.block || '',
      row: seat.row || 0,
      column: seat.column || 0,
      seatNumber: seat.seatNumber || '',
      categoryName: seat.categoryName || '',
      price: seat.price || 0,
      status: (seat.status as SeatStatus) || 'AVAILABLE',
      holdExpiresAt: seat.holdExpiresAt,
    };
  }

  private mapSeatLayout(layout: SeatLayoutData): SeatLayoutResponseDto {
    return {
      id: this.mapId(layout._id || layout.id || null),
      blocks: (layout.blocks || []).map((block) => ({
        blockName: block.blockName || '',
        rows: (block.rows || []).map((row) => ({
          rowNumber: row.rowNumber || 0,
          columns: row.columns || 0,
        })),
        category: {
          name: block.category?.name || '',
          price: block.category?.price || 0,
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
