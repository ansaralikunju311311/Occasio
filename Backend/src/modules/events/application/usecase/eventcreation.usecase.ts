import { EventStatus } from "../../../../common/enums/event-status.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
import { EventDto } from "../dtos/event.dto.js";
import { getLocationName } from "../../../../common/service/location.service.js";
import { normalizeCoordinates } from "../../../../common/utils/geo.util.js";
export class EventCretionUseCase{

    constructor(
        private eventRepository:IEventRepository
    ){}


  async execute(data: EventDto,userId:string) {


if (data.eventType !== "ONLINE") {

    // const {} = data;

    const {address} = data

    if (!address) {
      throw new Error("Location coordinates required");
    }    const  {longitude,latitude}= await getLocationName(address);

    // console.log("location finding the ",locationName)






   console.log("location",data.location , "longitude",longitude , "latitude",latitude);


  data.location={
    type:"Point",
    coordinates:[longitude,latitude],
      address

  };
}



console.log("thehhehe location",data.location)

   


    const status= EventStatus.ACTIVE;


console.log("sample", status)


    const {location,startTime,endTime} = data;


    const {longitude,latitude} = normalizeCoordinates(
      location?.coordinates[0],
      location?.coordinates[1]
    )
  
    console.log("checking come here ")

    const conflict = await this.eventRepository.findExactConflict(
      longitude,
      latitude,
      new Date(startTime),
      new Date(endTime)
    )

    console.log("the conflict here happen ", conflict)

    if(conflict){
      throw new Error("Duplicate EVent at same location and time")
    }



    console.log("evide varanindioooo")
    data.location.coordinates=[longitude,latitude];
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


