import { randomUUID } from 'crypto';

/**
 * Error codes for standardized error handling
 */
export enum ErrorCode {
  // Input validation errors (400)
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_INPUT = 'MISSING_INPUT',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  TEXT_TOO_LONG = 'TEXT_TOO_LONG',
  MALICIOUS_INPUT = 'MALICIOUS_INPUT',
  
  // Processing errors (422)
  OCR_FAILED = 'OCR_FAILED',
  LOW_OCR_CONFIDENCE = 'LOW_OCR_CONFIDENCE',
  EXTRACTION_FAILED = 'EXTRACTION_FAILED',
  AMBIGUOUS_INPUT = 'AMBIGUOUS_INPUT',
  
  // Server errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

/**
 * Custom error class with correlation ID and error code
 */
export class AppError extends Error {
  public readonly correlationId: string;
  public readonly errorCode: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.correlationId = randomUUID();
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: 'error',
      message: this.message,
      errorCode: this.errorCode,
      correlationId: this.correlationId,
      ...(this.details && { details: this.details })
    };
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.INVALID_INPUT, details?: any) {
    super(message, errorCode, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Processing error (422)
 */
export class ProcessingError extends AppError {
  constructor(message: string, errorCode: ErrorCode, details?: any) {
    super(message, errorCode, 422, details);
    this.name = 'ProcessingError';
  }
}

/**
 * Generate a correlation ID for tracking requests
 */
export function generateCorrelationId(): string {
  return randomUUID();
}
