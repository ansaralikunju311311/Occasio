import type { Response } from 'express';

export interface ISessionService {
  setRefreshToken(res: Response, token: string): void;
  clearRefreshToken(res: Response): void;
}
