import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { User } from "../../../domain/entites/user.entity.js";

export class UserDetailsUseCase{
     constructor(
        private userRepository :IUserRepository
     ){}


     async execute(userId:string):Promise< User| null>{

        const user = await this.userRepository.findById(userId);
        if(!user) return null;

        return user
     }
}