import mongoose from 'mongoose';

import type { IDbSession } from '../../../domain/services/transaction-manager.interface';
import { BaseRepository } from '../../repositories/base.repository';
import type { Events } from '../../../domain/entities/event.entity';
import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import type { IEventDocument } from '../../../infrastructure/database/model/events/event.model';
import { EventModel } from '../../../infrastructure/database/model/events/event.model';
import { SeatModel } from '../../../infrastructure/database/model/events/seat.model';
import { SeatLayoutModel } from '../../../infrastructure/database/model/events/seatLayout.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import { eventMapper } from '../../../common/mappers/event.mapper';
import { BookingModel } from '../../../infrastructure/database/model/booking.model';
import type { ManagerStatsResult } from '../../../domain/repositories/event/event.repository.interface';

export class EventRepository
  extends BaseRepository<IEventDocument>
  implements IEventRepository
{
  constructor() {
    super(EventModel);
  }

  async getManagerStats(managerId: string): Promise<ManagerStatsResult> {
    const managerObjId = new mongoose.Types.ObjectId(managerId);

    const totalEvents = await EventModel.countDocuments({
      createdBy: managerObjId,
    });
    const activeEvents = await EventModel.countDocuments({
      createdBy: managerObjId,
      status: 'LIVE',
    });

    const managerEvents = await EventModel.find(
      { createdBy: managerObjId },
      '_id title',
    );
    const eventIds = managerEvents.map((e) => e._id);

    const totalBookings = await BookingModel.countDocuments({
      eventId: { $in: eventIds },
      status: 'CONFIRMED',
    });

    const revenueResult = await BookingModel.aggregate([
      { $match: { eventId: { $in: eventIds }, status: 'CONFIRMED' } },
      { $group: { _id: null, totalRevenue: { $sum: '$organizerRevenue' } } },
    ]);

    const refundedResult = await BookingModel.aggregate([
      { $match: { eventId: { $in: eventIds }, status: 'CANCELLED' } },
      { $group: { _id: null, totalRefunded: { $sum: '$organizerRevenue' } } },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const totalRefunded = refundedResult[0]?.totalRefunded || 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const bookings = await BookingModel.find({
      eventId: { $in: eventIds },
      status: 'CONFIRMED',
      createdAt: { $gte: sixMonthsAgo },
    });

    const trend: ManagerStatsResult['trend'] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trend.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString('default', { month: 'short' }),
        revenue: 0,
        bookingsCount: 0,
      });
    }

    for (const booking of bookings) {
      const bDate = new Date(booking.createdAt);
      const m = trend.find(
        (x) => x.year === bDate.getFullYear() && x.month === bDate.getMonth(),
      );
      if (m) {
        m.revenue += booking.organizerRevenue;
        m.bookingsCount += 1;
      }
    }

    for (const m of trend) {
      m.revenue = Math.round(m.revenue);
    }

    const allBookings = await BookingModel.find({
      eventId: { $in: eventIds },
      status: 'CONFIRMED',
    });

    const eventDistribution = managerEvents
      .map((event) => {
        const eventBookings = allBookings.filter(
          (b) => b.eventId.toString() === event._id.toString(),
        );
        const totalAmount = eventBookings.reduce(
          (sum, b) => sum + b.organizerRevenue,
          0,
        );
        const ticketsSold = eventBookings.reduce(
          (sum, b) => sum + b.seats.length,
          0,
        );
        return {
          eventId: event._id.toString(),
          title: event.title,
          revenue: Math.round(totalAmount),
          ticketsSold,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalEvents,
      activeEvents,
      totalBookings,
      totalRevenue: Math.round(totalRevenue),
      totalRefunded: Math.round(totalRefunded),
      trend,
      eventDistribution,
    };
  }

  async createEvent(event: Events, session?: IDbSession): Promise<Events> {
    const mongoSession = session as unknown as mongoose.ClientSession;

    // Use the mapper to convert the domain entity to persistence format
    const persistenceData = eventMapper.toPersistence(event);

    // Explicitly cast createdBy to ObjectId as was done previously
    persistenceData.createdBy = new mongoose.Types.ObjectId(
      event.createdBy,
    ) as unknown as mongoose.Schema.Types.ObjectId;

    const events = await super.create(persistenceData, {
      session: mongoSession,
    });
    return eventMapper.toDomain(events as unknown as Record<string, unknown>);
  }

  async findAllEvents(
    params: PaginationParams,
  ): Promise<PaginatedResponse<Events>> {
    const { page = 1, limit = 10, search, eventType, upcoming } = params;
    const query: mongoose.FilterQuery<IEventDocument> = {
      isDeleted: { $ne: true },
    };

    if (eventType) {
      query.eventType = eventType as IEventDocument['eventType'];
    }

    if (upcoming) {
      query.endTime = { $gt: new Date() };
      query.status = { $in: [EventStatus.LIVE, EventStatus.ACTIVE] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.model
        .find(query)
        .populate('createdBy')
        .populate('seatLayoutId')
        .populate('seats')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    const data = events.map((event) =>
      eventMapper.toDomain(event as unknown as Record<string, unknown>),
    );

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByIdEvents(id: string): Promise<Events | null> {
    const event = await this.model
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('createdBy')
      .populate('seatLayoutId')
      .populate('seats');
    return event
      ? eventMapper.toDomain(event as unknown as Record<string, unknown>)
      : null;
  }

  async findExactConflict(
    longitude: number,
    latitude: number,
    startTime: Date,
    endTime: Date,
  ): Promise<Events | null> {
    const events = await this.model
      .findOne({
        'location.coordinates': [longitude, latitude],
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        isDeleted: { $ne: true },
      })
      .populate('createdBy')
      .populate('seatLayoutId')
      .populate('seats');
    return events
      ? eventMapper.toDomain(events as unknown as Record<string, unknown>)
      : null;
  }

  async findEvents(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Events>> {
    const { page = 1, limit = 10, search } = params;
    const query: mongoose.FilterQuery<IEventDocument> = {
      createdBy: userId as unknown as mongoose.Types.ObjectId,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.model
        .find(query)
        .populate('createdBy')
        .populate('seatLayoutId')
        .populate('seats')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    const data = events.map((event) =>
      eventMapper.toDomain(event as unknown as Record<string, unknown>),
    );

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateEventLayout(
    eventId: string,
    layoutId: string | null,
    session?: IDbSession,
  ) {
    const mongoSession = session as unknown as mongoose.ClientSession;
    if (!layoutId) {
      await this.model.findByIdAndUpdate(
        eventId,
        { $unset: { seatLayoutId: '' } },
        { session: mongoSession },
      );
    } else {
      await this.model.findByIdAndUpdate(
        eventId,
        { seatLayoutId: layoutId },
        { session: mongoSession },
      );
    }
  }

  async createSeats(seats: Record<string, unknown>[], session?: IDbSession) {
    const mongoSession = session as unknown as mongoose.ClientSession;
    await SeatModel.insertMany(seats, { session: mongoSession });
  }

  async createSeatLayout(
    data: Record<string, unknown>,
    session?: IDbSession,
  ): Promise<{ _id: string | null; [key: string]: unknown }> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    const [layout] = await SeatLayoutModel.create([data], {
      session: mongoSession,
    });
    const obj = layout.toObject();
    return { ...obj, _id: obj._id?.toString() || null };
  }

  async deleteSeatsByEventId(eventId: string, session?: IDbSession) {
    const mongoSession = session as unknown as mongoose.ClientSession;
    await SeatModel.deleteMany({ eventId }, { session: mongoSession });
  }

  async deleteLayoutByEventId(eventId: string, session?: IDbSession) {
    const mongoSession = session as unknown as mongoose.ClientSession;
    await SeatLayoutModel.deleteMany({ eventId }, { session: mongoSession });
  }

  async updateEvent(
    eventId: string,
    data: Partial<Events> & { layout?: unknown },
    session?: IDbSession,
    unsetData?: Record<string, unknown>,
  ): Promise<Events | null> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    const updateQuery: mongoose.UpdateQuery<IEventDocument> = { $set: data };
    if (unsetData) {
      updateQuery.$unset = unsetData;
    }
    const updated = await this.model.findByIdAndUpdate(eventId, updateQuery, {
      new: true,
      session: mongoSession,
    });
    return updated
      ? eventMapper.toDomain(updated as unknown as Record<string, unknown>)
      : null;
  }
  async deleteEvent(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(id, {
      status: EventStatus.CANCELED,
      isDeleted: true,
      deletedAt: new Date(),
    });
    return !!result;
  }

  async validateOwnershipAndDraft(
    eventId: string,
    userId: string,
  ): Promise<Events> {
    const event = await this.model.findOne({
      _id: eventId,
      createdBy: userId,
      status: EventStatus.DRAFT,
    });

    if (!event) {
      throw new Error('Event not found or not eligible for payment');
    }

    return eventMapper.toDomain(event as unknown as Record<string, unknown>);
  }

  async publishEvent(eventId: string): Promise<Events> {
    const event = await this.model.findById(eventId);
    if (!event) {
      throw new Error('Event not found during publishing');
    }

    if (
      (event.status === EventStatus.ACTIVE ||
        event.status === EventStatus.LIVE) &&
      event.isPublished
    ) {
      return eventMapper.toDomain(event as unknown as Record<string, unknown>); // Already published
    }

    event.status = EventStatus.ACTIVE;
    event.isPublished = true;
    if (!event.publishedAt) {
      event.publishedAt = new Date();
    }
    const updated = await event.save();
    return eventMapper.toDomain(updated as unknown as Record<string, unknown>);
  }
}
