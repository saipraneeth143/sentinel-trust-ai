"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = exports.scanRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Rate limiter for /api/v1/scan endpoint:
 * Maximum 30 scans per minute per IP to prevent denial-of-service or API key exhaustion.
 */
exports.scanRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TooManyRequests',
        message: 'Rate limit exceeded: Maximum 30 security scans per minute per IP allowed.',
    },
});
/**
 * General API rate limiter for all /api/v1 routes.
 */
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 180,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TooManyRequests',
        message: 'API rate limit exceeded. Please wait before sending additional requests.',
    },
});
