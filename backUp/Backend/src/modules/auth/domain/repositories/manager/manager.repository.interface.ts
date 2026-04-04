import { EventManager } from "../../entites/manager.entity.js";

export interface IEventManagerRepository {
        createManager(user: EventManager): Promise<EventManager>

        //  findOne(userId: string): Promise<EventManager | null>
         findByIdManager(id: string): Promise<EventManager | null>

}