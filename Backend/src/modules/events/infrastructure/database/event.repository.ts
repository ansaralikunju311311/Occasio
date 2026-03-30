import { BaseRepository } from "../../../../common/repositories/base.repository.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
import { IEventDocument } from "./event.model.js";
import { EventModel } from "./event.model.js";

export class EventRepository extends BaseRepository<IEventDocument> implements IEventRepository {

  constructor() {
    super(EventModel)
  }

  async createEvent(event: Events): Promise<Events> {
    const events = await super.create({
      title: event.title,
      description: event.description,
      createdBy: event.createdBy,
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
    // Sort by createdAt descending to show newest events first
    const query = eventType ? { eventType } : {};
    const events = await this.model.find(query).populate("createdBy").sort({ createdAt: -1 });
    return events.map((event) => this.toEntity(event));
  }


  async findByIdEvents(id: string): Promise<Events | null> {
    const event = await this.model.findById(id);
    return event ? this.toEntity(event) : null;
  }


  async findExactConflict(longitude: number, latitude: number, startTime: Date, endTime: Date): Promise<Events | null> {

    const events = await this.model.findOne({
      "location.coordinates": [longitude, latitude],
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    })


    console.log("evnts are coming in tis area", events)

    return events ? this.toEntity(events) : null;
  }

  async findEvents(userId: string): Promise<Events[] | null> {
      const event = await this.model.find({createdBy:userId}).sort({createdAt:-1})

      return event.map((event)=> this.toEntity(event))
  }

  private toEntity(manager: any): Events {

  let createdById;
  let creatorDetails;

  if (typeof manager.createdBy === "object") {
    // populate case
    createdById = manager.createdBy._id.toString();
    creatorDetails = manager.createdBy;
  } else {
    // normal case
    createdById = manager.createdBy.toString();
  }

  return new Events(
    manager._id.toString(),
    manager.title,
    manager.description,
    manager.eventType,
    manager.startTime,
    manager.endTime,
    manager.location && manager.location.type ? manager.location : undefined,
    manager.maxOnlineUsers,
    manager.price,
    createdById, // ✅ fixed
    manager.status,
    manager.picture,
    creatorDetails
  );
}
}
