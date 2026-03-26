import { UpdatePasswordDto } from "../../dtos/updatepassword.dto.js";
import { HttpStatus } from "../../../../../common/constants/http-stattus.js";
import { ErrorMessage } from "../../../../../common/enums/message.enum.js";
import { AppError } from "../../../../../common/errors/app-error.js";
import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { IHashServive } from "../../../domain/services/hash.service.interface.js";
import { UserStatus } from "../../../../../common/enums/user-status.enum.js";
import { User } from "../../../domain/entites/user.entity.js";
export class UpdatePasswordUseCase{
    constructor(
        private userRepository:IUserRepository,
        private compareService:IHashServive,
        private hashService:IHashServive

    ){}



    async execute(data:UpdatePasswordDto):Promise<User>{

    const user = await this.userRepository.findByEmail(data.email)
          if(!user){
                    throw new AppError(ErrorMessage.USER_NOT_FOUND,HttpStatus.NOT_FOUND)
                }
                
               const isMatch = await this.compareService.comapre(data.currentPassword,user.password)
              console.log("matching")
               if(!isMatch){
                console.log("the password is not matching")
                throw new AppError(ErrorMessage.INCORRECT_PASSWORD,HttpStatus.UNAUTHORIZED)
               }
            if(user.status === UserStatus.BLOCK){
                throw new AppError(ErrorMessage.ACCOUNT_BLOCKED,HttpStatus.UNAUTHORIZED)
            }
            const hashpassword = await this.hashService.hash(data.newPassword)

               const newUser = new User(
                                    user.id,
                                    user.name,
                                    user.email,
                                    hashpassword,
                                    user.role,
                                    user.status,
                                    user.isVerified,
                                    null,
                                    null,
                                    null,
                                    null,
                                    user.applyingupgrade,
                                                user.rejectedAt,
                                                user.reapplyAt

                                    
                                );

            return this.userRepository.updateOne(newUser)
    }
}