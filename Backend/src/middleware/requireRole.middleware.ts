
import { NextFunction,Response,Request } from "express";
import { HttpStatus } from "../common/constants/http-stattus.js";
export const requireRole = (roles:string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    console.log("for",user)
 console.log(roles)
    console.log("usr",user.role);
    

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    console.log(roles  , user.role)
    if (roles !== user.role) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
   
    next();
  };
};