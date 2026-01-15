import { sanitizeText, validateTextInput, validateFileUpload, validateInput } from '../validation';
import { ValidationError, ErrorCode } from '../errors';

describe('Validation Utils', () => {
  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      const input = 'Book <script>alert("xss")</script> appointment';
      const result = sanitizeText(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should remove SQL injection patterns', () => {
      const input = 'Book SELECT * FROM users WHERE';
      const result = sanitizeText(input);
      expect(result).not.toContain('SELECT');
    });

    it('should normalize whitespace', () => {
      const input = 'Book    appointment    tomorrow';
      const result = sanitizeText(input);
      expect(result).toBe('Book appointment tomorrow');
    });

    it('should trim whitespace', () => {
      const input = '  Book appointment  ';
      const result = sanitizeText(input);
      expect(result).toBe('Book appointment');
    });

    it('should limit length to MAX_TEXT_LENGTH', () => {
      const input = 'a'.repeat(10000);
      const result = sanitizeText(input);
      expect(result.length).toBeLessThanOrEqual(5000);
    });
  });

  describe('validateTextInput', () => {
    it('should pass for valid text', () => {
      expect(() => {
        validateTextInput('Book cardiology appointment tomorrow');
      }).not.toThrow();
    });

    it('should throw ValidationError for empty text', () => {
      expect(() => {
        validateTextInput('');
      }).toThrow(ValidationError);
      
      expect(() => {
        validateTextInput('   ');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for text too long', () => {
      const longText = 'a'.repeat(6000);
      expect(() => {
        validateTextInput(longText);
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for script tags', () => {
      expect(() => {
        validateTextInput('<script>alert(1)</script>');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for javascript: protocol', () => {
      expect(() => {
        validateTextInput('javascript:alert(1)');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for event handlers', () => {
      expect(() => {
        validateTextInput('Book <img onclick="alert(1)">');
      }).toThrow(ValidationError);
    });
  });

  describe('validateFileUpload', () => {
    it('should pass for valid JPEG file', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024 * 1024 // 1MB
      } as Express.Multer.File;

      expect(() => {
        validateFileUpload(mockFile);
      }).not.toThrow();
    });

    it('should pass for valid PNG file', () => {
      const mockFile = {
        mimetype: 'image/png',
        size: 1024 * 1024
      } as Express.Multer.File;

      expect(() => {
        validateFileUpload(mockFile);
      }).not.toThrow();
    });

    it('should throw ValidationError for invalid MIME type', () => {
      const mockFile = {
        mimetype: 'application/pdf',
        size: 1024 * 1024
      } as Express.Multer.File;

      expect(() => {
        validateFileUpload(mockFile);
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for file too large', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024 // 10MB
      } as Express.Multer.File;

      expect(() => {
        validateFileUpload(mockFile);
      }).toThrow(ValidationError);
    });

    it('should include error details for invalid file type', () => {
      const mockFile = {
        mimetype: 'image/gif',
        size: 1024
      } as Express.Multer.File;

      try {
        validateFileUpload(mockFile);
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError.errorCode).toBe(ErrorCode.INVALID_FILE_TYPE);
        expect(validationError.details).toBeDefined();
      }
    });
  });

  describe('validateInput', () => {
    it('should throw ValidationError when both text and file missing', () => {
      expect(() => {
        validateInput();
      }).toThrow(ValidationError);
    });

    it('should sanitize and return text when provided', () => {
      const result = validateInput('  Book appointment  ');
      expect(result).toBe('Book appointment');
    });

    it('should validate file when provided', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024
      } as Express.Multer.File;

      expect(() => {
        validateInput(undefined, mockFile);
      }).not.toThrow();
    });

    it('should prefer text over file when both provided', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024
      } as Express.Multer.File;

      const result = validateInput('Book appointment', mockFile);
      expect(result).toBe('Book appointment');
    });
  });
});
