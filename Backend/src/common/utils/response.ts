import type { Response } from 'express';

import { HttpStatus } from '../constants/http-status';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = HttpStatus.OK,
  extra: Record<string, unknown> = {},
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra,
  });
}
