import { User } from "../../entites/user.entity.js";
import { EventManager } from "../../entites/manager.entity.js";
export interface IAdminRepository{

    findAllUser():Promise<User[] | null> 
    findById(id:string):Promise<User | null>
     findByuserId(userId: string): Promise<EventManager | null>
}

