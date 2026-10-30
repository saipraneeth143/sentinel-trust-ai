"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetPolicies = handleGetPolicies;
exports.handleUpsertPolicy = handleUpsertPolicy;
const validateRequest_1 = require("../middlewares/validateRequest");
const db_service_1 = require("../services/db.service");
async function handleGetPolicies(req, res, next) {
    try {
        const workspaceId = (0, validateRequest_1.resolveWorkspaceId)(req);
        const policies = await (0, db_service_1.getPoliciesForWorkspace)(workspaceId);
        res.status(200).json({
            workspace_id: workspaceId,
            policies,
        });
    }
    catch (error) {
        next(error);
    }
}
async function handleUpsertPolicy(req, res, next) {
    try {
        const workspaceId = (0, validateRequest_1.resolveWorkspaceId)(req);
        const body = req.body;
        const saved = await (0, db_service_1.upsertPolicyForWorkspace)({
            ...body,
            workspace_id: body.workspace_id || workspaceId,
        });
        res.status(200).json(saved);
    }
    catch (error) {
        next(error);
    }
}
