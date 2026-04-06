import { User } from "../../../../domain/entities/user.entity";
import { IAdminRepository } from "../../../../domain/repositories/admin/admin.repository.interface";
import { IFindallUseCase } from "./findall.usecase.interface";




export class FindAllUseCase implements IFindallUseCase{
    constructor(
        private adminRepository: IAdminRepository
    ){}
    async execute():Promise<User[] | null>{
      const user = await this.adminRepository.findAllUser()

      return user
   }
}


