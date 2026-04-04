import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";

export class GetEventsUseCase{

   constructor(
    private eventRepository:IEventRepository
   ){}
    async execute(eventType:string){


        const events = await this.eventRepository.findAllEvents(eventType);
        return events
    }
}