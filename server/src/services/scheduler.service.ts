import { OCRService } from './ocr.service';
import { ExtractionService, ExtractedEntities } from './extractor.service';
import { NormalizationService } from './normalizer.service';

export class SchedulerService {
  private ocrService: OCRService;
  private extractionService: ExtractionService;
  private normalizationService: NormalizationService;

  constructor() {
    this.ocrService = new OCRService();
    this.extractionService = new ExtractionService();
    this.normalizationService = new NormalizationService();
  }

  async processRequest(input: { text?: string; imageBuffer?: Buffer }, correlationId?: string) {
    let rawText = input.text || '';
    let ocrConfidence = 1.0;

    // Step 1: OCR
    if (input.imageBuffer && !input.text) {
      const ocrResult = await this.ocrService.processImage(input.imageBuffer);
      rawText = ocrResult.raw_text;
      ocrConfidence = ocrResult.confidence;
    }

    if (!rawText) {
       return { status: 'error', message: 'No input provided', ...(correlationId && { correlationId }) };
    }

    // Step 2: Extraction
    const { entities, confidence: extractionConfidence } = this.extractionService.extractEntities(rawText);

    // Guardrail: Check for ambiguity
    if (!entities.department || !entities.parsedDate) {
      return {
        step1_ocr: { raw_text: rawText, confidence: ocrConfidence },
        step2_extraction: { entities, confidence: extractionConfidence },
        status: 'needs_clarification',
        message: 'Ambiguous date/time or department'
      };
    }

    // Step 3: Normalization
    const normalized = this.normalizationService.normalizeDateTime(entities.parsedDate);
    const normalizationConfidence = 0.95; // High confidence if date was parsed

    // Step 4: Final JSON
    return {
      step1_ocr: { raw_text: rawText, confidence: ocrConfidence },
      step2_extraction: { entities, confidence: extractionConfidence },
      step3_normalization: { normalized, confidence: normalizationConfidence },
      appointment: {
        department: this.capitalize(entities.department),
        date: normalized.date,
        time: normalized.time,
        tz: normalized.tz
      },
      status: 'ok'
    };
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
