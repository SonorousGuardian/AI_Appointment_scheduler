import { ValidationError, ErrorCode } from './errors';

/**
 * Allowed MIME types for image uploads
 */
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Maximum file size (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Maximum text input length (5000 characters)
 */
export const MAX_TEXT_LENGTH = 5000;

/**
 * Sanitize text input by removing potentially harmful content
 * @param text Input text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove potential SQL injection patterns
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Trim
    .trim()
    // Limit length
    .substring(0, MAX_TEXT_LENGTH);
}

/**
 * Validate text input
 * @param text Input text
 * @throws ValidationError if text is invalid
 */
export function validateTextInput(text: string): void {
  if (!text || text.trim().length === 0) {
    throw new ValidationError(
      'Text input cannot be empty',
      ErrorCode.MISSING_INPUT
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new ValidationError(
      `Text input too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`,
      ErrorCode.TEXT_TOO_LONG,
      { maxLength: MAX_TEXT_LENGTH, actualLength: text.length }
    );
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,  // Event handlers like onclick=
    /\b(eval|exec|system)\b/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      throw new ValidationError(
        'Input contains potentially malicious content',
        ErrorCode.MALICIOUS_INPUT
      );
    }
  }
}

/**
 * Validate file upload
 * @param file File object from multer
 * @throws ValidationError if file is invalid
 */
export function validateFileUpload(file: Express.Multer.File): void {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new ValidationError(
      `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      ErrorCode.INVALID_FILE_TYPE,
      { 
        allowedTypes: ALLOWED_MIME_TYPES, 
        receivedType: file.mimetype 
      }
    );
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      ErrorCode.FILE_TOO_LARGE,
      { 
        maxSize: MAX_FILE_SIZE, 
        actualSize: file.size,
        maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
        actualSizeMB: (file.size / (1024 * 1024)).toFixed(2)
      }
    );
  }
}

/**
 * Validate input (text or file)
 * @param text Text input (optional)
 * @param file File input (optional)
 * @returns Sanitized text if provided
 * @throws ValidationError if both are missing or invalid
 */
export function validateInput(text?: string, file?: Express.Multer.File): string | undefined {
  // Must have at least one input
  if (!text && !file) {
    throw new ValidationError(
      'Either text or image input is required',
      ErrorCode.MISSING_INPUT
    );
  }

  // Validate and sanitize text if provided
  if (text) {
    validateTextInput(text);
    return sanitizeText(text);
  }

  // Validate file if provided
  if (file) {
    validateFileUpload(file);
  }

  return undefined;
}
