import { BaseRepository } from "../../../../common/repositories/base.repository.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
import { IEventDocument } from "./event.model.js";
import { EventModel } from "./event.model.js";
import mongoose from "mongoose";
import { SeatModel } from "./seat.model.js";
import { SeatLayoutModel } from "./seatLayout.model.js";

export class EventRepository extends BaseRepository<IEventDocument> implements IEventRepository {

  constructor() {
    super(EventModel)
  }

  async createEvent(event: Events): Promise<Events> {
    const events = await super.create({
      title: event.title,
      description: event.description,
      createdBy: event.createdBy as any,
      endTime: event.endTime,
      eventType: event.eventType,
      location: event.location,
      maxOnlineUsers: event.maxOnlineUsers,
      picture: event.picture,
      price: event.price,
      startTime: event.startTime,
      status: event.status,
    })
    return this.toEntity(events)
  }

  async findAllEvents(eventType: string): Promise<Events[]> {
    const query = eventType ? { eventType } : {};
    const events = await this.model.find(query)
      .populate("createdBy")
      .populate("seatLayoutId")
      .populate("seats")
      .sort({ createdAt: -1 });

    return events.map((event) => this.toEntity(event));
  }

  async findByIdEvents(id: string): Promise<Events | null> {
    const event = await this.model.findById(id)
      .populate("createdBy")
      .populate("seatLayoutId")
      .populate("seats");
    return event ? this.toEntity(event) : null;
  }

  async findExactConflict(longitude: number, latitude: number, startTime: Date, endTime: Date): Promise<Events | null> {
    const events = await this.model.findOne({
      "location.coordinates": [longitude, latitude],
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    })
    .populate("createdBy")
    .populate("seatLayoutId")
    .populate("seats");

    console.log("events are coming in this area", events)
    return events ? this.toEntity(events) : null;
  }

  async findEvents(userId: string): Promise<Events[] | null> {
    const events = await this.model.find({ createdBy: userId } as any)
      .populate("createdBy")
      .populate("seatLayoutId")
      .populate("seats")
      .sort({ createdAt: -1 });

    return events.map((event) => this.toEntity(event));
  }

  async updateEventLayout(eventId: string, layoutId: string, session?: mongoose.ClientSession) {
    await this.model.findByIdAndUpdate(
      eventId,
      { seatLayoutId: layoutId },
      { session }
    );
  }

  async createSeats(seats: any[], session?: mongoose.ClientSession) {
    await SeatModel.insertMany(seats, { session });
  }

  async createSeatLayout(data: any, session?: mongoose.ClientSession) {
    const [layout] = await SeatLayoutModel.create([data], { session });
    return layout;
  }

  private toEntity(manager: any): Events {
    let createdById: string;
    let creatorDetails: any;

    if (manager.createdBy && typeof manager.createdBy === "object") {
      createdById = manager.createdBy._id?.toString() || manager.createdBy.toString();
      creatorDetails = manager.createdBy;
    } else {
      createdById = manager.createdBy?.toString() || "";
    }

    let seatLayoutId: string = "";
    let seatLayoutDetails: any = null;

    if (manager.seatLayoutId && typeof manager.seatLayoutId === "object") {
      seatLayoutId = manager.seatLayoutId._id?.toString() || manager.seatLayoutId.toString();
      seatLayoutDetails = manager.seatLayoutId;
    } else {
      seatLayoutId = manager.seatLayoutId?.toString() || "";
      seatLayoutDetails = manager.seatLayoutId;
    }

    return new Events(
      manager._id?.toString() || null,
      manager.title,
      manager.description,
      manager.eventType,
      manager.startTime,
      manager.endTime,
      manager.location && manager.location.type ? manager.location : undefined,
      manager.maxOnlineUsers,
      manager.price,
      createdById,
      manager.status,
      manager.picture,
      creatorDetails,
      seatLayoutId,
      seatLayoutDetails,
      manager.seats
    );
  }
}
