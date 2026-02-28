import { User } from "../entites/user.entity.js";

export interface IUserRepository{
    findByEmail(email:string):Promise<User | null>
    create(user:User):Promise<User>

    update(user:User):Promise<User>
}