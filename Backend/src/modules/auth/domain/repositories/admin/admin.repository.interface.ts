import { User } from "../../entites/user.entity.js";

export interface IAdminRepository{

    findAllUser():Promise<User[] | null> 
}

