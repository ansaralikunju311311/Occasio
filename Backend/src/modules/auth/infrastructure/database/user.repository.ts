import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";

import { User } from "../../domain/entites/user.entity.js";

import { UserModel } from "./user.model.js";

export class UserRepository implements IUserRepository{


    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({email});
        if(!doc) return null;

        return new User(
            doc.name,
            doc.email,
            doc.password,
            doc.role,
            doc.status
        )
    }


    async create(user: User): Promise<User> {
          const created = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status
    });

    return new User(
      created.name,
      created.email,
      created.password,
      created.role,
      created.status
    );
    }
}