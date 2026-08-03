import type { JwtPayload } from 'jsonwebtoken';
import type { AuthUser } from '../../common/type/auth.type';

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): AuthUser | JwtPayload | string;
  verifyRefreshToken(token: string): AuthUser | JwtPayload | string;
}
