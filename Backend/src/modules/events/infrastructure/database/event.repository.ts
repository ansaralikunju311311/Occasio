import { BaseRepository } from "../../../../common/repositories/base.repository.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
import { IEventDocument } from "./event.model.js";
import { EventModel } from "./event.model.js";
export class EventRepository extends BaseRepository<IEventDocument> implements IEventRepository{



    constructor()
    {
         super(EventModel)
    }


  async createEvent(event: Events): Promise<Events> {
      

      const events = await super.create({
        
        title:event.title,
        description:event.description,
        createdBy:event.createdBy,
        endTime:event.endTime,
        eventType:event.eventType,
        location:event.location,
        maxOnlineUsers:event.maxOnlineUsers,
        picture:event.picture,
        price:event.price,
        startTime:event.startTime,
        status:event.status,

    
      })
       return this.toEntity(events)
  }




  private toEntity(manager:any):Events{
    console.log("Mapping document to entity. Status:", manager.status, "Location Type:", manager.location?.type);
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
        manager.createdBy.toString(),
        manager.status,
        manager.picture,
    )
  }
}
