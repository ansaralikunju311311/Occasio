import type { NextFunction, Request, Response } from 'express';

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
