import { Request, Response } from 'express';
import { SchedulerService } from '../services/scheduler.service';
import multer from 'multer';
import { validateInput, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../utils/validation';
import { AppError, ValidationError, ErrorCode, generateCorrelationId } from '../utils/errors';

const schedulerService = new SchedulerService();

// Configure Multer for memory storage with validation
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError(
        `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
        ErrorCode.INVALID_FILE_TYPE
      ) as any);
    }
  }
});

export const parseAppointment = async (req: Request, res: Response) => {
  const correlationId = generateCorrelationId();
  
  try {
    const text = req.body.text;
    const file = req.file;

    // Validate and sanitize input
    const sanitizedText = validateInput(text, file);

    const result = await schedulerService.processRequest({
      text: sanitizedText,
      imageBuffer: file ? file.buffer : undefined
    }, correlationId);

    res.json(result);
  } catch (error) {
    console.error(`[${correlationId}] Controller Error:`, error);
    
    // Handle known application errors
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    
    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          errorCode: ErrorCode.FILE_TOO_LARGE,
          correlationId
        });
      }
      return res.status(400).json({
        status: 'error',
        message: error.message,
        errorCode: ErrorCode.INVALID_INPUT,
        correlationId
      });
    }
    
    // Handle unknown errors
    res.status(500).json({ 
      status: 'error', 
      message: 'An unexpected error occurred. Please try again later.',
      errorCode: ErrorCode.INTERNAL_ERROR,
      correlationId
    });
  }
};
