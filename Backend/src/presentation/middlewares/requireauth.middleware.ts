import { NextFunction, Request, Response } from 'express';
import { AuthUser } from '@/common/type/auth.type';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.authUser?.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};
