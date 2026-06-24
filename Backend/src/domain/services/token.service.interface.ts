/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}
