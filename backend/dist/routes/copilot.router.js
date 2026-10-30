"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copilotRouter = void 0;
const express_1 = require("express");
const copilot_controller_1 = require("../controllers/copilot.controller");
const validateRequest_1 = require("../middlewares/validateRequest");
const scan_schema_1 = require("../schemas/scan.schema");
exports.copilotRouter = (0, express_1.Router)();
exports.copilotRouter.post('/chat', (0, validateRequest_1.validateBody)(scan_schema_1.CopilotChatSchema), copilot_controller_1.handleCopilotChat);
