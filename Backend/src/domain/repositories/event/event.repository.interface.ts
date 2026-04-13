import { Events } from '../../../domain/entities/event.entity';
import mongoose from 'mongoose';
import { PaginationParams, PaginatedResponse } from '@/common/interfaces/pagination.interface';

export interface IEventRepository {
  createEvent(event: Events, session?: mongoose.ClientSession): Promise<Events>;
  createSeatLayout(data: any, session?: mongoose.ClientSession): Promise<any>;

  createSeats(seats: any[], session?: mongoose.ClientSession): Promise<void>;

  updateEventLayout(
    eventId: string,
    layoutId: string,
    session?: mongoose.ClientSession,
  ): Promise<void>;
  findAllEvents(params: PaginationParams): Promise<PaginatedResponse<Events> | null>;
  findByIdEvents(id: string): Promise<Events | null>;

  findExactConflict(
    longitude: number,
    latitude: number,
    startTime: Date,
    endTime: Date,
  ): Promise<Events | null>;
  findEvents(userId: string, params: PaginationParams): Promise<PaginatedResponse<Events> | null>;
}
