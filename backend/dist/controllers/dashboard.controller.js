"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHealthCheck = handleHealthCheck;
exports.handleGetDashboardStats = handleGetDashboardStats;
const db_1 = require("../config/db");
const validateRequest_1 = require("../middlewares/validateRequest");
const db_service_1 = require("../services/db.service");
async function handleHealthCheck(_req, res) {
    const dbConnected = await (0, db_1.checkPostgresConnection)();
    const grokConfigured = Boolean(process.env.XAI_API_KEY &&
        process.env.XAI_API_KEY !== 'xai-your-grok-api-key-here');
    res.status(200).json({
        status: 'ok',
        service: 'SentinelTrust AI Platform API',
        version: '1.0.0',
        engine: 'grok-4.7',
        grok_api_configured: grokConfigured,
        database_mode: dbConnected ? 'postgresql-rls' : 'in-memory-rls-replica',
        timestamp: new Date().toISOString(),
    });
}
async function handleGetDashboardStats(req, res, next) {
    try {
        const workspaceId = (0, validateRequest_1.resolveWorkspaceId)(req);
        const stats = await (0, db_service_1.getDashboardStats)(workspaceId);
        const workspaces = await (0, db_service_1.getWorkspaces)();
        res.status(200).json({
            workspace_id: workspaceId,
            workspaces,
            ...stats,
        });
    }
    catch (error) {
        next(error);
    }
}
