import { EventManager } from "../../entites/manager.entity.js";

export interface IEventManagerRepository {
        create(user: EventManager): Promise<EventManager>

        findOne(userId: string): Promise<EventManager | null>
        findByuserId(userId: string): Promise<EventManager | null>

}