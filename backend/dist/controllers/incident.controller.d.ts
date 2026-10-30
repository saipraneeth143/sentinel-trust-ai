import { NextFunction, Request, Response } from 'express';
export declare function handleGetIncidents(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function handleUpdateIncidentStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
