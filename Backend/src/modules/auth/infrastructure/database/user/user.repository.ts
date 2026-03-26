import { IUserRepository } from "../../../domain/repositories/user/user.repository.interface.js";

import { User } from "../../../domain/entites/user.entity.js";

import { UserModel } from "../user.model.js";

export class UserRepository implements IUserRepository {


    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email });
        if (!doc) return null;

        return new User(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.password,
            doc.role,
            doc.status,
            doc.isVerified,
            doc.otp,
            doc.otpExpires,
            doc.otpType,
            doc.otpSentAt,
            doc.applyingupgrade,
            doc.rejectedAt,
            doc.reapplyAt
        )
    }



    async findById(id: string): Promise<User | null> {
        console.log("gvhbjnkmlhgdrfghjkml,;.")
        const user = await UserModel.findById(id)
        if (!user) return null;
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.password,
            user.role,
            user.status,
            user.isVerified,
            user.otp,
            user.otpExpires,
            user.otpType,
            user.otpSentAt,
            user.applyingupgrade,
            user.rejectedAt,
            user.reapplyAt

        )

    }

    async create(user: User): Promise<User> {

        const created = await UserModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            otp: user.otp,
            otpExpires: user.otpExpires,
            otpType: user.otpType,
            otpSentAt: user.otpSendAt,
            applyingupgrade: user.applyingupgrade,
            rejectedAt: user.rejectedAt,
            reapplyAt: user.reapplyAt
        });

        return new User(
            created._id.toString(),
            created.name,
            created.email,
            created.password,
            created.role,
            created.status,
            created.isVerified,
            created.otp,
            created.otpExpires,
            created.otpType,
            created.otpSentAt,
            created.applyingupgrade,
            created.rejectedAt,
            created.reapplyAt

        );
    }

    async updateOne(user: User): Promise<User> {

        console.log("the user details", user.isVerified)

        await UserModel.updateOne(
            { email: user.email },


            {
                status: user.status,
                password: user.password,
                isVerified: user.isVerified,
                otp: user.otp,
                otpExpires: user.otpExpires,
                otpType: user.otpType,
                otpSentAt: user.otpSendAt,
                applyingupgrade: user.applyingupgrade,
                role: user.role,
                rejectedAt: user.rejectedAt,
                reapplyAt: user.reapplyAt
            }
        )

        console.log('after the updation the values', user)
        //  console.log('the user after the u[dation',user);
        //   return new User()
        return user
    }

}