import { UserModel } from "../../../database/models/user.model";
import type { IuserDocument } from "../../../database/models/user.model";
import type{ IUser } from "../../../common/types/user.type";

export class AuthRepository {
    async findByEmail(email:string): Promise<IuserDocument | null>{
        return UserModel.findOne({email})
    }
    
    async createUser(data:IUser):Promise<IuserDocument | null>{
        return UserModel.create(data)
    }
}