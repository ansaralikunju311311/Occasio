import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";

import { IHashServive } from "../../domain/services/hash.service.interface.js";
import { signupDTO } from "../dtos/signup.dto.js";
import { User } from "../../domain/entites/user.entity.js";


export class SignupUsecase{
    constructor(
        private userRepository:IUserRepository,
        private hashService :IHashServive
    ){}


    async execute(data:signupDTO):Promise<User>{
        const existingUser = await this.userRepository.findByEmail(data.email);
        if(existingUser){
            throw new Error('user already exists')
        }

        const hashpassword = await this.hashService.hash(data.password)

        const newUser = new User(
            data.name,
            data.email,
            hashpassword
        );
        return this.userRepository.create(newUser)
    }
}