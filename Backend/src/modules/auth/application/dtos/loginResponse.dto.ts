import { User } from "../../domain/entites/user.entity.js";

export interface LoginResponseDto{
    user:User,
    accessToken:string ,
    // refreshToken:string
}