import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for /api/v1/scan endpoint:
 * Maximum 30 scans per minute per IP to prevent denial-of-service or API key exhaustion.
 */
export const scanRateLimiter = rateLimit({
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
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TooManyRequests',
    message: 'API rate limit exceeded. Please wait before sending additional requests.',
  },
});

