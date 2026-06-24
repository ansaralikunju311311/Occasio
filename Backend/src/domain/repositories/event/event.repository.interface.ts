/* eslint-disable @typescript-eslint/no-explicit-any */
import type mongoose from 'mongoose';

import type { Events } from '../../../domain/entities/event.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import type { UpdateEventDTO } from '../../../application/dtos/updateevent.dto';

export interface IEventRepository {
  createEvent(event: Events, session?: mongoose.ClientSession): Promise<Events>;
  createSeatLayout(data: any, session?: mongoose.ClientSession): Promise<any>;

  createSeats(seats: any[], session?: mongoose.ClientSession): Promise<void>;

  updateEventLayout(
    eventId: string,
    layoutId: string | null,
    session?: mongoose.ClientSession,
  ): Promise<void>;
  findAllEvents(
    params: PaginationParams,
  ): Promise<PaginatedResponse<Events> | null>;
  findByIdEvents(id: string): Promise<Events | null>;

  findExactConflict(
    longitude: number,
    latitude: number,
    startTime: Date,
    endTime: Date,
  ): Promise<Events | null>;
  findEvents(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Events> | null>;

  updateEvent(
    eventId: string,
    data: UpdateEventDTO,
    session?: mongoose.ClientSession,
    unsetData?: any,
  ): Promise<Events | null>;
  deleteEvent(id: string): Promise<boolean>;
  deleteSeatsByEventId(
    eventId: string,
    session?: mongoose.ClientSession,
  ): Promise<void>;
  deleteLayoutByEventId(
    eventId: string,
    session?: mongoose.ClientSession,
  ): Promise<void>;

  validateOwnershipAndDraft(eventId: string, userId: string): Promise<Events>;
  publishEvent(eventId: string): Promise<Events>;
}
