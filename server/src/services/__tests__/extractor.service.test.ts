import { ExtractionService } from '../extractor.service';

describe('ExtractionService', () => {
  let service: ExtractionService;

  beforeEach(() => {
    service = new ExtractionService();
  });

  describe('Department Extraction', () => {
    it('should extract cardiology department', () => {
      const result = service.extractEntities('Book a cardiology appointment tomorrow at 10am');
      expect(result.entities.department).toBe('cardiology');
      expect(result.entities.parsedDate).toBeDefined();
    });

    it('should extract cardiologist and normalize to cardiology', () => {
      const result = service.extractEntities('Book appointment with cardiologist tomorrow at 10am');
      expect(result.entities.department).toBe('cardiology');
    });

    it('should extract neurology department', () => {
      const result = service.extractEntities('Schedule neurology consultation on Friday at 2pm');
      expect(result.entities.department).toBe('neurology');
    });

    it('should extract neurologist and normalize to neurology', () => {
      const result = service.extractEntities('I need to see a neurologist on Friday at 2pm');
      expect(result.entities.department).toBe('neurology');
    });

    it('should extract dentist department', () => {
      const result = service.extractEntities('Book dentist appointment tomorrow at 9am');
      expect(result.entities.department).toBe('dentist');
    });

    it('should extract dermatology department', () => {
      const result = service.extractEntities('Book dermatology checkup for next Wednesday at 3pm');
      expect(result.entities.department).toBe('dermatology');
    });

    it('should extract dermatologist and normalize to dermatology', () => {
      const result = service.extractEntities('Schedule with dermatologist next week');
      expect(result.entities.department).toBe('dermatology');
    });

    it('should extract orthopedics department', () => {
      const result = service.extractEntities('Orthopedics appointment needed');
      expect(result.entities.department).toBe('orthopedics');
    });

    it('should extract first department when multiple mentioned', () => {
      const result = service.extractEntities('I need cardiology and neurology appointments');
      expect(result.entities.department).toBe('cardiology');
    });

    it('should handle case-insensitive department names', () => {
      const result = service.extractEntities('BOOK NEUROLOGY APPOINTMENT');
      expect(result.entities.department).toBe('neurology');
    });

    it('should return undefined when no department found', () => {
      const result = service.extractEntities('Book appointment for tomorrow');
      expect(result.entities.department).toBeUndefined();
    });
  });

  describe('Time Extraction', () => {
    it('should extract time from "at 3pm"', () => {
      const result = service.extractEntities('Book dentist next Friday at 3pm');
      expect(result.entities.time_phrase).toBe('3pm');
      expect(result.entities.date_phrase).toBe('next Friday');
    });

    it('should extract time from "at 10am"', () => {
      const result = service.extractEntities('Book cardiology tomorrow at 10am');
      expect(result.entities.time_phrase).toBe('10am');
      expect(result.entities.date_phrase).toBe('tomorrow');
    });

    it('should extract time from "at 2:30pm"', () => {
      const result = service.extractEntities('Schedule on Friday at 2:30pm');
      expect(result.entities.time_phrase).toBe('2:30pm');
    });

    it('should extract 24-hour format time "at 14:30"', () => {
      const result = service.extractEntities('Schedule for January 18th at 14:30');
      expect(result.entities.time_phrase).toBe('14:30');
    });

    it('should NOT extract date numbers as time (January 20th)', () => {
      const result = service.extractEntities('Schedule on January 20th at 11:30am');
      expect(result.entities.time_phrase).toBe('11:30am');
      expect(result.entities.time_phrase).not.toBe('20');
    });

    it('should NOT extract date numbers as time (25/01/2026)', () => {
      const result = service.extractEntities('Book dentist on 25/01/2026 at 3pm');
      expect(result.entities.time_phrase).toBe('3pm');
      expect(result.entities.time_phrase).not.toBe('25');
    });

    it('should handle "tomorrow morning" without explicit time', () => {
      const result = service.extractEntities('Book neurology appointment tomorrow morning');
      expect(result.entities.parsedDate).toBeDefined();
      expect(result.entities.date_phrase).toBe('tomorrow morning');
    });
  });

  describe('Date Extraction', () => {
    it('should parse "next Monday"', () => {
      const result = service.extractEntities('Book appointment next Monday at 10am');
      expect(result.entities.parsedDate).toBeDefined();
      expect(result.entities.date_phrase).toBe('next Monday');
    });

    it('should parse "tomorrow"', () => {
      const result = service.extractEntities('Book appointment tomorrow at 3pm');
      expect(result.entities.parsedDate).toBeDefined();
      expect(result.entities.date_phrase).toBe('tomorrow');
    });

    it('should parse "next Friday"', () => {
      const result = service.extractEntities('Schedule for next Friday at 2pm');
      expect(result.entities.parsedDate).toBeDefined();
      expect(result.entities.date_phrase).toBe('next Friday');
    });

    it('should parse "in 5 days"', () => {
      const result = service.extractEntities('Schedule in 5 days at 11am');
      expect(result.entities.parsedDate).toBeDefined();
    });

    it('should parse specific date "December 25th 2026"', () => {
      const result = service.extractEntities('Schedule for December 25th 2026 at 10am');
      expect(result.entities.parsedDate).toBeDefined();
    });
  });

  describe('Confidence Calculation', () => {
    it('should have high confidence when both department and date found', () => {
      const result = service.extractEntities('Book cardiology appointment tomorrow at 10am');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should have lower confidence when only department found', () => {
      const result = service.extractEntities('Book cardiology appointment');
      expect(result.confidence).toBeLessThan(0.6);
    });

    it('should have lower confidence when only date found', () => {
      const result = service.extractEntities('Book appointment tomorrow at 10am');
      expect(result.confidence).toBeLessThan(0.7);
    });

    it('should have zero confidence when nothing found', () => {
      const result = service.extractEntities('Random text with no appointment info');
      expect(result.confidence).toBe(0);
    });
  });
});
