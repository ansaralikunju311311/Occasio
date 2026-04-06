import { AuthUser } from "../../common/type/auth.type";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}