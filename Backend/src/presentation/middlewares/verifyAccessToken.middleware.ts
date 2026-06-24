import type { NextFunction, Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { CreateToken } from '../../common/services/token.service';
import { ErrorMessage } from '../../common/enums/message-enum';
import type { AuthUser } from '../../common/type/auth.type';
import { logger } from '../../common/logger/logger';

const tokenService = new CreateToken();
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: ErrorMessage.TOKEN_MISSING,
    });
  }

  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: ErrorMessage.TOKEN_MISSING,
    });
  }
  try {
    const decode = tokenService.verifyAccessToken(token);
    req.authUser = decode as AuthUser;
    next();
  } catch (error: unknown) {
    logger.error(
      'Token verification failed:',
      error instanceof Error ? error : new Error(String(error)),
    );
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: ErrorMessage.INVALID_TOKEN });
  }
};
