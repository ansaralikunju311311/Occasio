import { User } from "../../entites/user.entity.js";

export interface IAdminRepository{

    findAllUser():Promise<User[] | null> 
    findById(id:string):Promise<User | null>
}

