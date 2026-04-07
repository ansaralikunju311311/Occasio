import { IEventRepository } from "../../../../domain/repositories/event/event.repository.interface";

import { IGetEventsUseCase } from "./getEvents.usecase.interface";

export class GetEventsUseCase implements IGetEventsUseCase {

   constructor(
    private eventRepository:IEventRepository
   ){}
    async execute(eventType:string,search?:string){


        const events = await this.eventRepository.findAllEvents(eventType,search);
        return events
    }
}