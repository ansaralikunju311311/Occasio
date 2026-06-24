import type { NextFunction, Response, Request } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { UserModel } from '../../infrastructure/database/model/user.model';
import { logger } from '../../common/logger/logger';

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.authUser;

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    try {
      const dbUser = await UserModel.findById(user.userId);
      if (!dbUser) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'User not found' });
      }

      if (!roles.includes(dbUser.role)) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: 'Forbidden' });
      }

      if (req.authUser) {
        req.authUser.role = dbUser.role as string;
      }
      next();
    } catch (error) {
      logger.error(
        'requireRole error:',
        error instanceof Error ? error : new Error(String(error)),
      );
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
