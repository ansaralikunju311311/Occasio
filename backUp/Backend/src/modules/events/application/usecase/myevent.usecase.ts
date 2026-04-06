import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";

import { IMyEventsUseCase } from "./myevent.usecase.interface";

export class MyEventsUseCase implements IMyEventsUseCase {
    constructor(
        private eventRepository:IEventRepository
    ){}


    async execute(userId:string){
        const events = await this.eventRepository.findEvents(userId)
        return events
    }
}