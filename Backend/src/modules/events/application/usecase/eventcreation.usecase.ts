import { EventStatus } from "../../../../common/enums/event-status.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
export class EventCretionUseCase{

    constructor(
        private eventRepository:IEventRepository
    ){}


  async execute(data: any,userId:string) {


    console.log("checking this data",data)
  const status= EventStatus.ACTIVE
  const eventEntity = new Events(
    null,
    data.title,
    data.description,
    data.eventType,
    new Date(data.startTime),
    new Date(data.endTime),
    data.location || undefined,
    data.maxOnlineUsers,
    data.price,
    userId,
    status,
    data.bannerUrl
  );

  const event = await this.eventRepository.createEvent(eventEntity);

  return event;
}

}


