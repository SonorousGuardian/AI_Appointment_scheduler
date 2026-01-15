import Tesseract from 'tesseract.js';

export class OCRService {
  /**
   * Extracts text from an image buffer using Tesseract.js
   * @param imageBuffer Buffer containing the image data
   * @returns Promise<{ raw_text: string; confidence: number }>
   */
  async processImage(imageBuffer: Buffer): Promise<{ raw_text: string; confidence: number }> {
    try {
      const result = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: _m => {}, // Silence logger
      });

      const { text, confidence } = result.data;
      
      // Clean up text (basic trimming)
      const cleanedText = text.replace(/\s+/g, ' ').trim();

      return {
        raw_text: cleanedText,
        confidence: confidence / 100, // Normalize to 0-1
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to process image OCR');
    }
  }
}
