import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth.respository";
import type{ IUser } from "../../../common/types/user.type";
import { UserRole } from "../../../common/enums/user-role.enum";
import { UserStatus } from "../../../common/enums/user-status.enum";

export class AuthService {
  private repo = new AuthRepository();

  async signup(data: IUser) {

    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.repo.createUser({
      ...data,
      password: hashedPassword,
      role: data.role || UserRole.USER,
      isBlocked: UserStatus.ACTIVE
    });
  }
}
