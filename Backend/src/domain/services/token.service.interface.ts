import type { AuthUser } from '../../common/type/auth.type';

export interface IDomainJwtPayload {
  userId: string;
  role: string;
  email?: string;
  [key: string]: unknown;
}

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): AuthUser | IDomainJwtPayload | string;
  verifyRefreshToken(token: string): AuthUser | IDomainJwtPayload | string;
}
