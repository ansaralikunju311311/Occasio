import { IEventRepository } from "../../../../domain/repositories/event/event.repository.interface";

import { IMyEventsUseCase } from "./myevents.usecase.interface";

export class MyEventsUseCase implements IMyEventsUseCase {
    constructor(
        private eventRepository:IEventRepository
    ){}


    async execute(userId: string, search?: string) {
        const events = await this.eventRepository.findEvents(userId, search);
        return events;
    }
}