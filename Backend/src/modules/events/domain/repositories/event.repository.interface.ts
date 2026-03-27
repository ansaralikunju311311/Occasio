import { Events } from "../entities/events.entity.js";

export interface IEventRepository{


    createEvent(event:Events):Promise<Events>
}