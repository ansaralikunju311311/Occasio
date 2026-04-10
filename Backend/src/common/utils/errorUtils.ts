import { AppError } from '../errors/apperror';


export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};


export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};
