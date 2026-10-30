import { NextFunction, Request, Response } from 'express';
export declare function handleHealthCheck(_req: Request, res: Response): Promise<void>;
export declare function handleGetDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void>;
