import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
export declare const DEFAULT_WORKSPACE_ID = "11111111-1111-4111-8111-111111111111";
/**
 * Extracts and verifies the tenant workspace UUID from `X-Workspace-ID` header,
 * request body, or query parameters to enforce multi-tenant RLS isolation.
 */
export declare function resolveWorkspaceId(req: Request): string;
/**
 * Middleware factory that validates `req.body` against a Zod schema
 * and injects `workspace_id` from `X-Workspace-ID` header if not already in body.
 */
export declare function validateBody(schema: AnyZodObject): (req: Request, res: Response, next: NextFunction) => void;
