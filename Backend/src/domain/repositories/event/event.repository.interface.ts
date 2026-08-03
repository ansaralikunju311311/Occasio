import type { IDbSession } from '../../services/transaction-manager.interface';
import type { Events } from '../../entities/event.entity';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

export interface ManagerStatsResult {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  totalRevenue: number;
  totalRefunded: number;
  trend: Array<{
    year: number;
    month: number;
    label: string;
    revenue: number;
    bookingsCount: number;
  }>;
  eventDistribution: Array<{
    eventId: string;
    title: string;
    revenue: number;
    ticketsSold: number;
  }>;
}

export interface IEventRepository {
  createEvent(event: Events, session?: IDbSession): Promise<Events>;
  createSeatLayout(
    data: Record<string, unknown>,
    session?: IDbSession,
  ): Promise<{ _id: string | null; [key: string]: unknown }>;

  createSeats(
    seats: Record<string, unknown>[],
    session?: IDbSession,
  ): Promise<void>;

  updateEventLayout(
    eventId: string,
    layoutId: string | null,
    session?: IDbSession,
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
    data: Partial<Events> & { layout?: any },
    session?: IDbSession,
    unsetData?: Record<string, unknown>,
  ): Promise<Events | null>;
  deleteEvent(id: string): Promise<boolean>;
  deleteSeatsByEventId(
    eventId: string,
    session?: IDbSession,
  ): Promise<void>;
  deleteLayoutByEventId(
    eventId: string,
    session?: IDbSession,
  ): Promise<void>;

  validateOwnershipAndDraft(eventId: string, userId: string): Promise<Events>;
  publishEvent(eventId: string): Promise<Events>;
  getManagerStats(managerId: string): Promise<ManagerStatsResult>;
}
