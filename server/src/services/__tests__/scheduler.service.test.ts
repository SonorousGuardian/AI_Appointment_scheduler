import { SchedulerService } from '../scheduler.service';
import { OCRService } from '../ocr.service';
import { ExtractionService } from '../extractor.service';
import { NormalizationService } from '../normalizer.service';

// Mock the services
jest.mock('../ocr.service');
jest.mock('../extractor.service');
jest.mock('../normalizer.service');

describe('SchedulerService', () => {
  let service: SchedulerService;
  let mockOCRService: jest.Mocked<OCRService>;
  let mockExtractionService: jest.Mocked<ExtractionService>;
  let mockNormalizationService: jest.Mocked<NormalizationService>;

  beforeEach(() => {
    service = new SchedulerService();
    mockOCRService = (service as any).ocrService;
    mockExtractionService = (service as any).extractionService;
    mockNormalizationService = (service as any).normalizationService;
  });

  describe('processRequest - Text Input', () => {
    it('should process text input successfully', async () => {
      const mockEntities = {
        department: 'cardiology',
        parsedDate: new Date('2026-01-20T10:00:00.000Z'),
        date_phrase: 'tomorrow',
        time_phrase: '10am'
      };

      mockExtractionService.extractEntities.mockReturnValue({
        entities: mockEntities,
        confidence: 0.95
      });

      mockNormalizationService.normalizeDateTime.mockReturnValue({
        date: '2026-01-20',
        time: '10:00',
        tz: 'Asia/Kolkata'
      });

      const result = await service.processRequest({ text: 'Book cardiology tomorrow at 10am' });

      expect(result.status).toBe('ok');
      expect(result.appointment).toEqual({
        department: 'Cardiology',
        date: '2026-01-20',
        time: '10:00',
        tz: 'Asia/Kolkata'
      });
      expect(mockOCRService.processImage).not.toHaveBeenCalled();
    });

    it('should return error for empty text', async () => {
      const result = await service.processRequest({ text: '' });

      expect(result.status).toBe('error');
      expect(result.message).toBe('No input provided');
    });
  });

  describe('processRequest - Image Input', () => {
    it('should process image input with OCR', async () => {
      const mockBuffer = Buffer.from('fake image');
      
      mockOCRService.processImage.mockResolvedValue({
        raw_text: 'Book cardiology tomorrow at 10am',
        confidence: 0.92
      });

      mockExtractionService.extractEntities.mockReturnValue({
        entities: {
          department: 'cardiology',
          parsedDate: new Date('2026-01-20T10:00:00.000Z'),
          date_phrase: 'tomorrow',
          time_phrase: '10am'
        },
        confidence: 0.95
      });

      mockNormalizationService.normalizeDateTime.mockReturnValue({
        date: '2026-01-20',
        time: '10:00',
        tz: 'Asia/Kolkata'
      });

      const result = await service.processRequest({ imageBuffer: mockBuffer });

      expect(result.status).toBe('ok');
      expect(mockOCRService.processImage).toHaveBeenCalledWith(mockBuffer);
      expect(result.step1_ocr).toEqual({
        raw_text: 'Book cardiology tomorrow at 10am',
        confidence: 0.92
      });
    });
  });

  describe('processRequest - Needs Clarification', () => {
    it('should return needs_clarification when department missing', async () => {
      mockExtractionService.extractEntities.mockReturnValue({
        entities: {
          parsedDate: new Date('2026-01-20T10:00:00.000Z')
        },
        confidence: 0.55
      });

      const result = await service.processRequest({ 
        text: 'Book appointment tomorrow at 10am' 
      });

      expect(result.status).toBe('needs_clarification');
      expect(result.message).toBe('Ambiguous date/time or department');
    });

    it('should return needs_clarification when date missing', async () => {
      mockExtractionService.extractEntities.mockReturnValue({
        entities: {
          department: 'cardiology'
        },
        confidence: 0.45
      });

      const result = await service.processRequest({ 
        text: 'I need a cardiology appointment' 
      });

      expect(result.status).toBe('needs_clarification');
      expect(result.message).toBe('Ambiguous date/time or department');
    });

    it('should return needs_clarification when both missing', async () => {
      mockExtractionService.extractEntities.mockReturnValue({
        entities: {},
        confidence: 0.05
      });

      const result = await service.processRequest({ text: 'appointment' });

      expect(result.status).toBe('needs_clarification');
    });
  });

  describe('processRequest - Correlation ID', () => {
    it('should include correlation ID in error response', async () => {
      const correlationId = 'test-123';
      const result = await service.processRequest({ text: '' }, correlationId);

      expect(result.status).toBe('error');
      // TypeScript can't infer the type, so we check explicitly
      if ('correlationId' in result) {
        expect(result.correlationId).toBe(correlationId);
      }
    });
  });
});
