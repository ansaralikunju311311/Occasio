import type { Response } from 'express';

import type { ISessionService } from '../interfaces/session.interface';

export class SessionService implements ISessionService {
  setRefreshToken(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.MAX_AGE),
    });
  }

  clearRefreshToken(res: Response): void {
    res.clearCookie('refreshToken');
  }
}
