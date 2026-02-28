import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";

import { User } from "../../domain/entites/user.entity.js";

import { UserModel } from "./user.model.js";

export class UserRepository implements IUserRepository{


    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({email});
        if(!doc) return null;

        return new User(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.password,
            doc.role,
            doc.status,
            doc.isVerfiled,
            doc.otp,
            doc.otpExpires,
            doc.otpType,
            doc.otpSentAt
        )
    }


    async create(user: User): Promise<User> {
        // console.log('user',user.role)
          const created = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      isVerfiled:user.isVerfied,
      otp:user.otp,
      otpExpires:user.otpExpires,
      otpType:user.otpType,
      otpSentAt:user.otpSendAt
    });

    return new User(
        created._id.toString(),
      created.name,
      created.email,
      created.password,
      created.role,
      created.status,
      created.isVerfiled,
      created.otp,
      created.otpExpires,
      created.otpType,
      created.otpSentAt
    );
    }

    async update(user:User):Promise<User>{
        // console.log('the user coming here for the upation',user)
         await UserModel.updateOne(
            {email:user.email},
            {isVerfiled:user.isVerfied,
             otp:user.otp,
             otpExpires:user.otpExpires,
             otpType:user.otpType,
             otpSentAt:user.otpSendAt
            }
         )
        //  console.log('the user after the u[dation',user);
        //   return new User()
        return user
    }
   
}