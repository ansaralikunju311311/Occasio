import { EventStatus } from "../../../../common/enums/event-status.js";
import { Events } from "../../domain/entities/events.entity.js";
import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";
import { EventDto } from "../dtos/event.dto.js";
import { getLocationName } from "../../../../common/service/location.service.js";
import { normalizeCoordinates } from "../../../../common/utils/geo.util.js";
import mongoose from "mongoose";
import { SeatStatus } from "../../../../common/enums/seat-status.js";
export class EventCretionUseCase{

    constructor(
        private eventRepository:IEventRepository
    ){}


  async execute(data: EventDto,userId:string) {




  const session = await mongoose.startSession();
  session.startTransaction();



  try{
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

  const event = await this.eventRepository.createEvent(eventEntity,session);


  const layout = await this.eventRepository.createSeatLayout({
    eventId:event.id,
    blocks:data.layout.blocks
  },session)



  const seats:any[] = [];


  for(const block of data.layout.blocks){
    for(const row of block.rows){
      for(let c = 1;c<=row.columns;c++){
        seats.push({
          eventId:event.id,
          layoutId:layout._id,
          block:block.blockName,
          row:row.rowNumber,
          column:c,
          seatNumber:`${block.blockName}-${row.rowNumber}-${c}`,
          categoryName:block.category.name,
          price:block.category.price,
          status:SeatStatus.AVAILABLE,
          holdExpiresAt:null

        })
      }
    }
  }

  await this.eventRepository.createSeats(seats,session);
  await this.eventRepository.updateEventLayout(
    event.id,
    layout._id,
    session
  )
   await session.commitTransaction();
    session.endSession();
  return event;
}

  catch (error) {
     
      await session.abortTransaction();
      session.endSession();
      throw error;
    }


  }


}


