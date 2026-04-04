import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";

export class EventDetailsUseCase{

    constructor(
        private eventRepository:IEventRepository
    ){}

    async execute(id: string) {
        const events = await this.eventRepository.findByIdEvents(id);
        console.log("events in execute:", events);
        return events;
    }
}