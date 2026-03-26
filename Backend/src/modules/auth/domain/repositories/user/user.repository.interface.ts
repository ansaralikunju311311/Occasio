import { User } from "../../entites/user.entity.js";

export interface IUserRepository{
    findByEmail(email:string):Promise<User | null>
    create(user:User):Promise<User>
    updateOne(user:User):Promise<User>
    findById(id:string):Promise<User|null>
}