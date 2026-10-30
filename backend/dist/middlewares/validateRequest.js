"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_WORKSPACE_ID = void 0;
exports.resolveWorkspaceId = resolveWorkspaceId;
exports.validateBody = validateBody;
const zod_1 = require("zod");
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
exports.DEFAULT_WORKSPACE_ID = '11111111-1111-4111-8111-111111111111';
/**
 * Extracts and verifies the tenant workspace UUID from `X-Workspace-ID` header,
 * request body, or query parameters to enforce multi-tenant RLS isolation.
 */
function resolveWorkspaceId(req) {
    const headerWorkspace = req.header('X-Workspace-ID') || req.header('x-workspace-id');
    const bodyWorkspace = req.body?.workspace_id;
    const queryWorkspace = typeof req.query?.workspace_id === 'string' ? req.query.workspace_id : undefined;
    const candidate = headerWorkspace || bodyWorkspace || queryWorkspace || exports.DEFAULT_WORKSPACE_ID;
    if (!UUID_REGEX.test(candidate)) {
        throw new Error('Invalid X-Workspace-ID header: must be a valid UUID.');
    }
    return candidate;
}
/**
 * Middleware factory that validates `req.body` against a Zod schema
 * and injects `workspace_id` from `X-Workspace-ID` header if not already in body.
 */
function validateBody(schema) {
    return (req, res, next) => {
        try {
            const workspaceId = resolveWorkspaceId(req);
            if (req.body && typeof req.body === 'object' && !req.body.workspace_id) {
                req.body.workspace_id = workspaceId;
            }
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    error: 'ValidationError',
                    message: 'Invalid request payload',
                    details: error.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            res.status(400).json({
                error: 'TenantValidationError',
                message: error instanceof Error ? error.message : 'Invalid request parameters',
            });
        }
    };
}
