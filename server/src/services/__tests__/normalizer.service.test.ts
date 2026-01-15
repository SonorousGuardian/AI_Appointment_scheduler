import { NormalizationService } from '../normalizer.service';

describe('NormalizationService', () => {
  let service: NormalizationService;

  beforeEach(() => {
    service = new NormalizationService();
  });

  describe('normalizeDateTime', () => {
    it('should normalize date to yyyy-MM-dd format', () => {
      const date = new Date('2026-01-20T10:30:00.000Z');
      const result = service.normalizeDateTime(date);
      
      expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should normalize time to HH:mm format', () => {
      const date = new Date('2026-01-20T10:30:00.000Z');
      const result = service.normalizeDateTime(date);
      
      expect(result.time).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should include timezone', () => {
      const date = new Date('2026-01-20T10:30:00.000Z');
      const result = service.normalizeDateTime(date);
      
      expect(result.tz).toBe('Asia/Kolkata');
    });

    it('should handle midnight correctly', () => {
      const date = new Date('2026-01-16T18:30:00.000Z'); // Midnight IST
      const result = service.normalizeDateTime(date);
      
      expect(result.time).toBe('00:00'); // Fixed: was '0:00', should be '00:00'
    });

    it('should handle noon correctly', () => {
      const date = new Date('2026-01-19T06:30:00.000Z'); // Noon IST
      const result = service.normalizeDateTime(date);
      
      expect(result.date).toBe('2026-01-19');
    });

    it('should convert UTC time to Asia/Kolkata timezone', () => {
      const utcDate = new Date('2026-01-20T04:30:00.000Z'); // 10:00 AM IST
      const result = service.normalizeDateTime(utcDate);
      
      // Should be converted to IST
      expect(result.tz).toBe('Asia/Kolkata');
      expect(result.date).toBe('2026-01-20');
    });

    it('should handle different times of day correctly', () => {
      const morning = new Date('2026-01-20T03:30:00.000Z'); // 9:00 AM IST
      const afternoon = new Date('2026-01-20T09:00:00.000Z'); // 2:30 PM IST
      const evening = new Date('2026-01-20T15:00:00.000Z'); // 8:30 PM IST
      
      const resultMorning = service.normalizeDateTime(morning);
      const resultAfternoon = service.normalizeDateTime(afternoon);
      const resultEvening = service.normalizeDateTime(evening);
      
      expect(resultMorning.time).toMatch(/^0\d:\d{2}$/);
      expect(resultAfternoon.time).toMatch(/^1\d:\d{2}$/);
      expect(resultEvening.time).toMatch(/^2\d:\d{2}$/);
    });
  });
});
