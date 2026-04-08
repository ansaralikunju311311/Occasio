import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { CreateToken } from '../../common/services/token.service';
import { ErrorMessage } from '../../common/enums/message-enum';
import { AuthUser } from '@/common/type/auth.type';

const tokenService = new CreateToken();
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('checking the red', req.headers);
  console.log('reced');
  const authHeader = req.headers.authorization;
  console.log('evode ntha kittane?', authHeader);
  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: ErrorMessage.TOKEN_MISSING,
    });
  }

  const token = authHeader?.split(' ')[1];
  console.log('this is the token', token);
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: ErrorMessage.TOKEN_MISSING,
    });
  }
  try {
    const decode = tokenService.verifyAccessToken(token);
    req.authUser = decode as AuthUser;
    console.log('middleware passes', req.authUser);

    console.log('fdkjnkjenjnjdnvf;jadsnvjdnkjkfnadj');
    next();
  } catch (error) {
    console.log('error', error);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: ErrorMessage.INVALID_TOKEN });
  }
};
