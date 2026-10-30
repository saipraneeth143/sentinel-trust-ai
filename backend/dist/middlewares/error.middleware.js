"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[SentinelTrust Error ${statusCode}]:`, message);
    res.status(statusCode).json({
        error: statusCode === 500 ? 'InternalServerError' : 'RequestError',
        message,
        ...(err.details ? { details: err.details } : {}),
        timestamp: new Date().toISOString(),
    });
}
