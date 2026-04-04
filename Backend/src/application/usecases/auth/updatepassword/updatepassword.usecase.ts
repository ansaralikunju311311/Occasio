import { UpdatePasswordDto } from "../../../dtos/updatepassword.dto";
import { HttpStatus } from "../../../../common/constants/http-status";
import { ErrorMessage } from "../../../../common/enums/message-enum";
import { AppError } from "../../../../common/errors/apperror";
import { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { IHashServive } from "../../../../domain/services/hash.service.interface";
import { UserStatus } from "../../../../common/enums/userstatus-enum";
import { User } from "../../../../domain/entities/user.entity";
import { IUpdateUseCase } from "./update.usecase.interface";
export class UpdatePasswordUseCase implements IUpdateUseCase{
    constructor(
        private userRepository:IUserRepository,
        private compareService:IHashServive,
        private hashService:IHashServive

    ){}



    async execute(data:UpdatePasswordDto):Promise<void>{

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
                                   
                                    user.applyingupgrade,
                                                user.rejectedAt,
                                                user.reapplyAt

                                    
                                );

            await this.userRepository.updateUser(newUser)
    }
}