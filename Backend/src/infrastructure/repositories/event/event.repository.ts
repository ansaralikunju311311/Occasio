import { BaseRepository } from "../../repositories/base.repository";
import { Events } from "../../../domain/entities/event.entity";
import { IEventRepository } from "../../../domain/repositories/event/event.repository.interface";
import { IEventDocument } from "../../../infrastructure/database/model/events/event.model";
import { EventModel } from "../../../infrastructure/database/model/events/event.model";
import mongoose from "mongoose";
import { SeatModel } from "../../../infrastructure/database/model/events/seat.model";
import { SeatLayoutModel } from "../../../infrastructure/database/model/events/seatLayout.model";

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

  async findAllEvents(eventType: string,search?:string): Promise<Events[]> {
    const query: any = {};
    
     if (eventType) {
    query.eventType = eventType;
  }

  if (search) {
    query.$or = [

      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      {email:{$regex:search,$options:"i"}},
            {eventType:{$regex:search,$options:"i"}},

    ];
  }
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

  async findEvents(userId: string, search?: string): Promise<Events[] | null> {
    const query: any = { createdBy: userId as any };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { eventType: { $regex: search, $options: "i" } }
      ];
    }

    const events = await this.model.find(query)
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
