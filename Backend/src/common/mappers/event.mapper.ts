import type mongoose from 'mongoose';

import { Events } from '../../domain/entities/event.entity';
import type { EventResponseDto } from '../../application/dtos/responses/event-response.dto';
import type { SeatResponseDto } from '../../application/dtos/responses/seat-response.dto';
import type { SeatLayoutResponseDto } from '../../application/dtos/responses/seat-layout-response.dto';
import type { SeatStatus } from '../../common/enums/searstatus-enum';
import { EventStatus } from '../../common/enums/eventstatus-enum';
import type { User } from '../../domain/entities/user.entity';
import type { IEventDocument } from '../../infrastructure/database/model/events/event.model';

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
  toDomain(doc: Record<string, unknown>): Events {
    let createdById: string;
    let creatorDetails: User | undefined;

    if (doc.createdBy && typeof doc.createdBy === 'object') {
      const c = doc.createdBy as Record<string, unknown>;
      createdById =
        (c._id as mongoose.Types.ObjectId)?.toString() || c.toString();
      creatorDetails = doc.createdBy as User;
    } else {
      createdById = doc.createdBy?.toString() || '';
    }

    let seatLayoutId: string = '';
    let seatLayoutDetails: Record<string, unknown> | undefined = undefined;

    if (doc.seatLayoutId && typeof doc.seatLayoutId === 'object') {
      const s = doc.seatLayoutId as Record<string, unknown>;
      seatLayoutId =
        (s._id as mongoose.Types.ObjectId)?.toString() || s.toString();
      seatLayoutDetails = s;
    } else {
      seatLayoutId = doc.seatLayoutId?.toString() || '';
      seatLayoutDetails = doc.seatLayoutId as
        | Record<string, unknown>
        | undefined;
    }

    return new Events(
      (doc._id as mongoose.Types.ObjectId)?.toString() || null,
      doc.title as string,
      doc.description as string,
      doc.eventType as IEventDocument['eventType'],
      doc.startTime as Date,
      doc.endTime as Date,
      doc.location && (doc.location as { type?: string }).type
        ? (doc.location as Events['location'])
        : undefined,
      doc.maxOnlineUsers as number | undefined,
      Number(doc.price || 0),
      createdById,
      doc.status as EventStatus,
      doc.picture as string,
      creatorDetails,
      seatLayoutId,
      seatLayoutDetails as Events['SeatLayout'],
      doc.seats as Record<string, unknown>[] | undefined,
      Boolean(doc.isPublished),
      Boolean(doc.isDeleted),
      doc.deletedAt as Date | undefined,
      doc.bookedTickets as number | undefined,
      doc.publishedAt as Date | undefined,
    );
  }

  toPersistence(entity: Events): Record<string, unknown> {
    const isLive = entity.status === EventStatus.LIVE;
    return {
      title: entity.title,
      description: entity.description,
      createdBy: entity.createdBy, // We will cast this to ObjectId in the repository or just leave it as string if Mongoose casts it
      endTime: entity.endTime,
      eventType: entity.eventType,
      location: entity.location,
      maxOnlineUsers: entity.maxOnlineUsers,
      picture: entity.picture,
      price: entity.price,
      startTime: entity.startTime,
      status: entity.status,
      isPublished: isLive,
      publishedAt: isLive ? new Date() : undefined,
    };
  }

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
