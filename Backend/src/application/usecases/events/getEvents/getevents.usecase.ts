import { IEventRepository } from "../../../../domain/repositories/event/event.repository.interface";

export class GetEventsUseCase{

   constructor(
    private eventRepository:IEventRepository
   ){}
    async execute(eventType:string){


        const events = await this.eventRepository.findAllEvents(eventType);
        return events
    }
}