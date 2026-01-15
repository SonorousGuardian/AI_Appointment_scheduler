import rateLimit from 'express-rate-limit';
import { ErrorCode } from '../utils/errors';

/**
 * Rate limiter for API endpoints
 * Limits requests to prevent abuse, especially for CPU-intensive OCR operations
 */
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
    errorCode: ErrorCode.RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests that don't use OCR (text-only)
  skipSuccessfulRequests: false,
});

/**
 * Stricter rate limiter for OCR endpoint
 * OCR is CPU-intensive, so we limit it more aggressively
 */
export const ocrRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 OCR requests per minute
  message: {
    status: 'error',
    message: 'Too many OCR requests. Please try again later.',
    errorCode: ErrorCode.RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false,
});
