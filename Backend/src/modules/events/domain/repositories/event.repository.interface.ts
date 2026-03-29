import { Events } from "../entities/events.entity.js";

export interface IEventRepository{


    createEvent(event:Events):Promise<Events>
    findAllEvents():Promise<Events[] | null>
    findByIdEvents(id:string):Promise<Events | null>

    findExactConflict(longitude:number,latitude:number,startTime:Date,endTime:Date):Promise<Events | null>
}