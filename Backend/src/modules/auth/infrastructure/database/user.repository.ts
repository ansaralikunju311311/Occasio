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
        )
    }


    async create(user: User): Promise<User> {
        console.log('user',user.role)
          const created = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      isVerfiled:user.isVerfied
    });

    return new User(
        created._id.toString(),
      created.name,
      created.email,
      created.password,
      created.role,
      created.status,
      created.isVerfiled
    );
    }
}