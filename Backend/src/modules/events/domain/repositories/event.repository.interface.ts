import { Events } from "../entities/events.entity.js";

export interface IEventRepository{


    createEvent(event:Events):Promise<Events>
    findAllEvents(eventType:string):Promise<Events[] | null>
    findByIdEvents(id:string):Promise<Events | null>

    findExactConflict(longitude:number,latitude:number,startTime:Date,endTime:Date):Promise<Events | null>
    findEvents(userId:string):Promise<Events[] | null>
}