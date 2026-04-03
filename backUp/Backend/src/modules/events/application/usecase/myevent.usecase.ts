import { IEventRepository } from "../../domain/repositories/event.repository.interface.js";

export class MyEventsUseCase{
    constructor(
        private eventRepository:IEventRepository
    ){}


    async execute(userId:string){
        const events = await this.eventRepository.findEvents(userId)
        return events
    }
}