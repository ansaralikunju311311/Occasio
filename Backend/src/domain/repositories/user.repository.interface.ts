import { OTP } from "domain/entities/otp.entity";
import { User } from "../../domain/entities/user.entity";

export interface IUserRepository{
    findByEmail(email:string):Promise<User | null>
    createUser(user:User):Promise<User>
    updateUser(user:User):Promise<User>
    findByIdUser(id:string):Promise<User|null>
}