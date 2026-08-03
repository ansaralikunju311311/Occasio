import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

import type { ITokenService, IDomainJwtPayload } from '../../domain/services/token.service.interface';
import type { AuthUser } from '../type/auth.type';

export class CreateToken implements ITokenService {
  generateAccessToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: process.env.JWT_ACCESS_EXPIRES as StringValue,
    };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, options);
  }

  generateRefreshToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES as StringValue,
    };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, options);
  }

  verifyAccessToken(token: string): AuthUser | IDomainJwtPayload | string {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as
      | AuthUser
      | IDomainJwtPayload
      | string;
  }

  verifyRefreshToken(token: string): AuthUser | IDomainJwtPayload | string {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as
      | AuthUser
      | IDomainJwtPayload
      | string;
  }
}
