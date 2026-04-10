import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { AppError } from '../../common/errors/apperror';
import { ErrorMessage } from '../../common/enums/message-enum';
import { isAppError, isError } from '../../common/utils/errorUtils';

/**
 * Global error handling middleware for Express.
 * This middleware catches all errors passed to next() and formats them into a consistent JSON response.
 */
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the error for debugging (use a logger in production)
  console.error('[ErrorMiddleware]:', err);

  // Handle custom AppError
  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle standard Error
  if (isError(err)) {
    // In development, we might want to send the stack trace or more details
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: err.message || ErrorMessage.INTERNAL_SERVER_ERROR,
      ...(isDevelopment && { stack: err.stack }),
    });
  }

  // Handle generic unknown errors
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: ErrorMessage.INTERNAL_SERVER_ERROR,
  });
};
