import { NextFunction, Request, Response } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    details?: unknown;
}
export declare function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void;
