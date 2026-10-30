import { NextFunction, Request, Response } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[SentinelTrust Error ${statusCode}]:`, message);

  res.status(statusCode).json({
    error: statusCode === 500 ? 'InternalServerError' : 'RequestError',
    message,
    ...(err.details ? { details: err.details } : {}),
    timestamp: new Date().toISOString(),
  });
}

