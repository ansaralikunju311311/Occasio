import { EventManager } from "../../entites/manager.entity.js";

export interface IEventManagerRepository{
        create(user:EventManager):Promise<EventManager>
    
}