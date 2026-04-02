import { User } from "../../../domain/entites/user.entity.js";
import { IAdminRepository } from "../../../domain/repositories/admin/admin.repository.interface.js";

export class FindAllUseCase{
    constructor(
        private adminRepository: IAdminRepository
    ){}

   

    async execute():Promise<User[] | null>{
      const user = await this.adminRepository.findAllUser()

      return user
   }



}


