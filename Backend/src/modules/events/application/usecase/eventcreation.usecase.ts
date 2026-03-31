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

      const { address } = data;

      if (!address) {
        throw new Error("Location address required");
      }
      const loc = await getLocationName(address);
      if (!loc) {
        throw new Error("Could not find coordinates for the provided address");
      }
      const { longitude, latitude } = loc;

      console.log("location", data.location, "longitude", longitude, "latitude", latitude);

      data.location = {
        type: "Point",
        coordinates: [longitude, latitude],
        address
      };
    }



console.log("thehhehe location",data.location)

   


    const status= EventStatus.ACTIVE;


console.log("sample", status)


    const { startTime, endTime } = data;
    let location = data.location;

    if (data.eventType !== "ONLINE") {
      const { longitude, latitude } = normalizeCoordinates(
        location?.coordinates?.[0] ?? 0,
        location?.coordinates?.[1] ?? 0
      );

      const conflict = await this.eventRepository.findExactConflict(
        longitude,
        latitude,
        new Date(startTime),
        new Date(endTime)
      );

      if (conflict) {
        throw new Error("Duplicate Event at same location and time");
      }

      if (data.location) {
        data.location.coordinates = [longitude, latitude];
      }
    } else {
      // For ONLINE events, ensure location is not sent with NaN coordinates
      data.location = undefined;
    }

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
      data.bannerUrl,
      undefined, // creatorDetails
      "", // seatLayoutId (will be updated later)
      undefined, // SeatLayout
      undefined // seats
    );

  const event = await this.eventRepository.createEvent(eventEntity,session);

  if (data.eventType !== "ONLINE") {
    if (!data.layout?.blocks) {
      throw new Error("Seat layout blocks are required");
    }

    const layout = await this.eventRepository.createSeatLayout({
      eventId: event.id,
      blocks: data.layout.blocks
    }, session);

    const seats: any[] = [];

    for (const block of data.layout.blocks) {
      for (const row of block.rows) {
        for (let c = 1; c <= row.columns; c++) {
          seats.push({
            eventId: event.id,
            layoutId: layout._id,
            block: block.blockName,
            row: row.rowNumber,
            column: c,
            seatNumber: `${block.blockName}-${row.rowNumber}-${c}`,
            categoryName: block.category.name,
            price: block.category.price,
            status: SeatStatus.AVAILABLE,
            holdExpiresAt: null
          });
        }
      }
    }

    await this.eventRepository.createSeats(seats, session);
    
    if (!event.id) {
      throw new Error("Event ID not generated");
    }

    await this.eventRepository.updateEventLayout(
      event.id,
      layout._id,
      session
    );
  }

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


