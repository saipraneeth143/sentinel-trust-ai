"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incidentRouter = void 0;
const express_1 = require("express");
const incident_controller_1 = require("../controllers/incident.controller");
exports.incidentRouter = (0, express_1.Router)();
exports.incidentRouter.get('/', incident_controller_1.handleGetIncidents);
exports.incidentRouter.patch('/:id/status', incident_controller_1.handleUpdateIncidentStatus);
