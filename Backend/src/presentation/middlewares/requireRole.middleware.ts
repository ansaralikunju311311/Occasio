import { NextFunction, Response, Request } from "express";
import { HttpStatus } from "../../common/constants/http-status";
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.authUser;
    console.log("for", user)
    console.log(roles)

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    console.log("usr", user.role);
    console.log(roles, user.role)
    if (!roles.includes(user.role)) {

      console.log("evide vannoooooo")
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }

    next();
  };
};