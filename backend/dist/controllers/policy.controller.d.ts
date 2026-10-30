import { NextFunction, Request, Response } from 'express';
export declare function handleGetPolicies(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function handleUpsertPolicy(req: Request, res: Response, next: NextFunction): Promise<void>;
