"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetIncidents = handleGetIncidents;
exports.handleUpdateIncidentStatus = handleUpdateIncidentStatus;
const validateRequest_1 = require("../middlewares/validateRequest");
const scan_schema_1 = require("../schemas/scan.schema");
const db_service_1 = require("../services/db.service");
async function handleGetIncidents(req, res, next) {
    try {
        const workspaceId = (0, validateRequest_1.resolveWorkspaceId)(req);
        const severity = typeof req.query.severity === 'string' ? req.query.severity : undefined;
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const category = typeof req.query.category === 'string' ? req.query.category : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const incidents = await (0, db_service_1.getIncidentsForWorkspace)(workspaceId, {
            severity,
            status,
            category,
            search,
        });
        res.status(200).json({
            workspace_id: workspaceId,
            total: incidents.length,
            incidents,
        });
    }
    catch (error) {
        next(error);
    }
}
async function handleUpdateIncidentStatus(req, res, next) {
    try {
        const workspaceId = (0, validateRequest_1.resolveWorkspaceId)(req);
        const incidentId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const parsed = scan_schema_1.UpdateIncidentStatusSchema.parse(req.body);
        const updated = await (0, db_service_1.updateIncidentStatus)(workspaceId, incidentId, parsed.status);
        if (!updated) {
            res.status(404).json({
                error: 'NotFound',
                message: `Incident ${incidentId} not found in workspace ${workspaceId}.`,
            });
            return;
        }
        res.status(200).json(updated);
    }
    catch (error) {
        next(error);
    }
}
