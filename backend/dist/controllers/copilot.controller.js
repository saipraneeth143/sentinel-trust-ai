"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCopilotChat = handleCopilotChat;
const validateRequest_1 = require("../middlewares/validateRequest");
const db_service_1 = require("../services/db.service");
const grok_service_1 = require("../services/grok.service");
async function handleCopilotChat(req, res, next) {
    try {
        const workspaceId = (0, validateRequest_1.resolveWorkspaceId)(req);
        const body = req.body;
        const incidentContext = body.incident_id
            ? await (0, db_service_1.getIncidentById)(workspaceId, body.incident_id)
            : null;
        const response = await (0, grok_service_1.chatWithGrokCopilot)(body.message, body.history || [], incidentContext);
        res.status(200).json({
            workspace_id: workspaceId,
            incident_id: body.incident_id || null,
            reply: response.reply,
            model: response.model,
            recommendations: response.recommendations,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
}
