"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleScanPayload = handleScanPayload;
const validateRequest_1 = require("../middlewares/validateRequest");
const db_service_1 = require("../services/db.service");
const grok_service_1 = require("../services/grok.service");
async function handleScanPayload(req, res, next) {
    try {
        const body = req.body;
        const workspaceId = body.workspace_id || (0, validateRequest_1.resolveWorkspaceId)(req);
        const analysisResult = await (0, grok_service_1.analyzePayloadWithGrok)(body.payload, body.sensitivity_level, body.target_frameworks, body.auto_redact);
        const savedScan = await (0, db_service_1.saveScanAndIncidents)(workspaceId, body.payload, analysisResult, body.sensitivity_level, body.target_frameworks);
        res.status(200).json(savedScan);
    }
    catch (error) {
        next(error);
    }
}
