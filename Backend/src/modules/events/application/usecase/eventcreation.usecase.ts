import { EventStatus } from "../../../../common/enums/event-status.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
import { EventDto } from "../dtos/event.dto.js";
import { getLocationName } from "../../../../common/service/location.service.js";
export class EventCretionUseCase{

    constructor(
        private eventRepository:IEventRepository
    ){}


  async execute(data: EventDto,userId:string) {


if (data.eventType !== "ONLINE") {

    const { latitude, longitude } = data;

    if (!latitude || !longitude) {
      throw new Error("Location coordinates required");
    }    const locationName = await getLocationName(latitude, longitude);

    console.log("location finding the ",locationName)



  console.log(data.location);


  data.location={
    type:"Point",
    coordinates:[longitude,latitude],
      address:locationName

  };
}


    const status= EventStatus.ACTIVE;


    console.log(data.location)
  console.log("latitude",data.latitude   , "longitude",data.longitude)
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


