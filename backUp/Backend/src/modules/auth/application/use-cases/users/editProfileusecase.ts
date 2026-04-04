import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";
import { User } from "../../../domain/entites/user.entity.js";
export class EditProfileUseCase{
     constructor(
        private userRepository:IUserRepository
     ){}

     async execute(userId:string,name:string):Promise<User | null>{
        const data = await this.userRepository.findByIdUser(userId);

          if(!data) return null

           const newUser = new User(
                      null,
                      data.name=name,
                      data.email,
                      data.hashpassword,
                      data.role,
                      data.status,
                      data.isVerified,
                       data?.otp,
                      data?.otpExpires,
                     data?.otpSendAt,
                      data?.otpType,
                      data.applyingupgrade,
                      data.rejectedAt,
                      data.reapplyAt
          
                  );
         return  await this.userRepository.updateUser(newUser);
        
     }
}