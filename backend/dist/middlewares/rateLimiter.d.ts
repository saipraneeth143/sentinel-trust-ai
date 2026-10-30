/**
 * Rate limiter for /api/v1/scan endpoint:
 * Maximum 30 scans per minute per IP to prevent denial-of-service or API key exhaustion.
 */
export declare const scanRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * General API rate limiter for all /api/v1 routes.
 */
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
