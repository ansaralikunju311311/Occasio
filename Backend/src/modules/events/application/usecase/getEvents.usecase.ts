import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";

export class GetEventsUseCase{

   constructor(
    private eventRepository:IEventRepository
   ){}
    async execute(){


        const events = await this.eventRepository.findAllEvents();
        return events
    }
}