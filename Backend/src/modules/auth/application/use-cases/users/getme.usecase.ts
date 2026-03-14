import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { AppError } from "../../../../../common/errors/app-error.js";
export class GetmeUseCase{
    constructor(
        private userRepository :IUserRepository
    ){}



    async execute(id:string){
        console.log("evidunn as chyne",id)
        const user = await this.userRepository.findById(id)
        console.log("get the correct user",user)

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
    }
}