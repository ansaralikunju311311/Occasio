import { IEventRepository } from "../../../../domain/repositories/event/event.repository.interface";

import { IEventDetailsUseCase } from "./eventdetails.usecase.interface";

export class EventDetailsUseCase implements IEventDetailsUseCase {

    constructor(
        private eventRepository:IEventRepository
    ){}

    async execute(id: string) {
        const events = await this.eventRepository.findByIdEvents(id);
        console.log("events in execute:", events);
        return events;
    }
}