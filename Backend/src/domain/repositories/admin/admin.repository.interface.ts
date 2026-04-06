import { User } from "../../entities/user.entity";
import { EventManager } from "../../entities/manager.entity";
export interface IAdminRepository{

    findAllUser():Promise<User[] | null> 
    findById(id:string):Promise<User | null>
     findByuserId(userId: string): Promise<EventManager | null>
}

