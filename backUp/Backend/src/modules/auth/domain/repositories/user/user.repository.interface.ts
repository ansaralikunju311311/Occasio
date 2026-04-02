import { User } from "../../entites/user.entity.js";

export interface IUserRepository{
    findByEmail(email:string):Promise<User | null>
    createUser(user:User):Promise<User>
    updateUser(user:User):Promise<User>
    findByIdUser(id:string):Promise<User|null>
}