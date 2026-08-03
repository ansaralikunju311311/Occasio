import mongoose from 'mongoose';

import { BaseRepository } from '../../repositories/base.repository';
import { Events } from '../../../domain/entities/event.entity';
import type { IEventRepository } from '../../../domain/repositories/event/event.repository.interface';
import type { IEventDocument } from '../../../infrastructure/database/model/events/event.model';
import { EventModel } from '../../../infrastructure/database/model/events/event.model';
import { SeatModel } from '../../../infrastructure/database/model/events/seat.model';
import { SeatLayoutModel } from '../../../infrastructure/database/model/events/seatLayout.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import type { UpdateEventDTO } from '../../../application/dtos/updateevent.dto';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import type { User } from '../../../domain/entities/user.entity';

export class EventRepository
  extends BaseRepository<IEventDocument>
  implements IEventRepository
{
  constructor() {
    super(EventModel);
  }

  async createEvent(event: Events): Promise<Events> {
    const isLive = event.status === EventStatus.LIVE;
    const events = await super.create({
      title: event.title,
      description: event.description,
      createdBy: new mongoose.Types.ObjectId(
        event.createdBy,
      ) as unknown as mongoose.Schema.Types.ObjectId,
      endTime: event.endTime,
      eventType: event.eventType,
      location: event.location,
      maxOnlineUsers: event.maxOnlineUsers,
      picture: event.picture,
      price: event.price,
      startTime: event.startTime,
      status: event.status,
      isPublished: isLive,
      publishedAt: isLive ? new Date() : undefined,
    });
    return this.toEntity(events);
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

    const data = events.map((event) => this.toEntity(event));

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
    return event ? this.toEntity(event) : null;
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
    return events ? this.toEntity(events) : null;
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

    const data = events.map((event) => this.toEntity(event));

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
    session?: mongoose.ClientSession,
  ) {
    if (!layoutId) {
      await this.model.findByIdAndUpdate(
        eventId,
        { $unset: { seatLayoutId: '' } },
        { session },
      );
    } else {
      await this.model.findByIdAndUpdate(
        eventId,
        { seatLayoutId: layoutId },
        { session },
      );
    }
  }

  async createSeats(
    seats: Record<string, unknown>[],
    session?: mongoose.ClientSession,
  ) {
    await SeatModel.insertMany(seats, { session });
  }

  async createSeatLayout(
    data: Record<string, unknown>,
    session?: mongoose.ClientSession,
  ): Promise<{ _id: string | null; [key: string]: unknown }> {
    const [layout] = await SeatLayoutModel.create([data], { session });
    const obj = layout.toObject();
    return { ...obj, _id: obj._id?.toString() || null };
  }

  async deleteSeatsByEventId(
    eventId: string,
    session?: mongoose.ClientSession,
  ) {
    await SeatModel.deleteMany({ eventId }, { session });
  }

  async deleteLayoutByEventId(
    eventId: string,
    session?: mongoose.ClientSession,
  ) {
    await SeatLayoutModel.deleteMany({ eventId }, { session });
  }

  async updateEvent(
    eventId: string,
    data: UpdateEventDTO,
    session?: mongoose.ClientSession,
    unsetData?: Record<string, unknown>,
  ): Promise<Events | null> {
    const updateQuery: mongoose.UpdateQuery<IEventDocument> = { $set: data };
    if (unsetData) {
      updateQuery.$unset = unsetData;
    }
    const updated = await this.model.findByIdAndUpdate(eventId, updateQuery, {
      new: true,
      session,
    });
    return updated ? this.toEntity(updated) : null;
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

    return this.toEntity(event);
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
      return this.toEntity(event); // Already published
    }

    event.status = EventStatus.ACTIVE;
    event.isPublished = true;
    if (!event.publishedAt) {
      event.publishedAt = new Date();
    }
    const updated = await event.save();
    return this.toEntity(updated);
  }

  private toEntity(
    manager:
      | IEventDocument
      | mongoose.HydratedDocument<IEventDocument>
      | Record<string, unknown>,
  ): Events {
    const doc = manager as Record<string, unknown>;
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
}
