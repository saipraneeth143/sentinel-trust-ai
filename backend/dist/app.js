"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
const api_router_1 = require("./routes/api.router");
exports.app = (0, express_1.default)();
const allowedOrigins = new Set([
    env_1.env.CORS_ORIGIN,
    env_1.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]);
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins.has(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.onrender.com')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-ID'],
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: '150kb' }));
// Root health check route for Render / cloud load balancers
exports.app.get('/', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'SentinelTrust AI Backend API',
        health_endpoint: '/api/v1/health',
        docs: 'Use /api/v1/scan, /api/v1/dashboard/stats, /api/v1/incidents, /api/v1/copilot/chat, /api/v1/policies',
    });
});
exports.app.use('/api/v1', api_router_1.apiRouter);
exports.app.use(error_middleware_1.errorHandler);
