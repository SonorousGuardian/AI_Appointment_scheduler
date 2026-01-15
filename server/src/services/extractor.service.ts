import * as chrono from 'chrono-node';

export interface ExtractedEntities {
  date_phrase?: string;
  time_phrase?: string;
  department?: string;
  parsedDate?: Date;
}

export class ExtractionService {
  private departments = ['cardiology', 'cardiologist', 'neurology', 'neurologist', 'dentist', 'dermatology', 'dermatologist', 'general', 'orthopedics', 'orthopedist'];

  /**
   * Extracts entities (Date, Time, Department) from text
   * @param text Normalized text
   * @returns { entities: ExtractedEntities, confidence: number }
   */
  extractEntities(text: string): { entities: ExtractedEntities; confidence: number } {
    const entities: ExtractedEntities = {};
    let confidence = 0.0;

    // 1. Extract Date/Time using Chrono
    // Chrono parses "next Friday at 3pm" well.
    const parsedResults = chrono.parse(text);

    if (parsedResults.length > 0) {
      const result = parsedResults[0];
      entities.parsedDate = result.start.date();
      entities.date_phrase = result.text; // "next Friday at 3pm" - simplistic. 
      
      // Attempt to separate date and time phrases if possible, or just use the full text
      // For now, we'll store the full phrase as captured by chrono
      // Refinement: regex for time pattern in the match text?
    }

    // 2. Extract Department (Keyword matching)
    const lowerText = text.toLowerCase();
    for (const dept of this.departments) {
      if (lowerText.includes(dept)) {
        // Normalize department names (e.g., cardiologist -> cardiology)
        entities.department = this.normalizeDepartment(dept);
        break;
      }
    }

    // 3. Calculate Confidence
    let score = 0;
    if (entities.parsedDate) score += 0.5;
    if (entities.department) score += 0.4;
    confidence = score > 0 ? score + 0.05 : 0; // Base confidence if anything found

    // Adjust specific phrase extraction for the example "Book dentist next Friday at 3pm"
    // Chrono usually captures "next Friday at 3pm".
    // We can try to split it if needed, but for the prompt's simplicity, the combined phrase or just logic is fine.
    // The prompt asks for: "date_phrase": "next Friday", "time_phrase": "3pm".
    
    if (parsedResults.length > 0) {
        // Rudimentary split for date vs time phrase based on known patterns if needed.
        // For "next Friday at 3pm", chrono text is "next Friday at 3pm".
        // Let's try to parse more granularly or just return what we have.
        // For the assignment, I will do a best-effort split.
        const combined = parsedResults[0].text;
        // Improved regex to match time patterns:
        // - 3pm, 3:30pm, 3:30 PM (12-hour format)
        // - 14:30, 14:00 (24-hour format)
        // - noon, midnight (special cases handled by chrono)
        // Must have either : or am/pm to avoid matching standalone numbers
        const timeMatch = combined.match(/(\d{1,2}:\d{2}(?:\s*(?:am|pm))?|\d{1,2}\s*(?:am|pm)(?!\d))/i);
        if (timeMatch) {
            entities.time_phrase = timeMatch[0].trim();
            entities.date_phrase = combined.replace(timeMatch[0], '').replace(/\bat\b/i, '').trim();
        } else {
            // If no explicit time found, the whole phrase is the date phrase
            entities.date_phrase = combined;
        }
    }

    return { entities, confidence };
  }

  /**
   * Normalize department names to standard forms
   * @param dept The department keyword found
   * @returns Normalized department name
   */
  private normalizeDepartment(dept: string): string {
    const mapping: { [key: string]: string } = {
      'cardiologist': 'cardiology',
      'neurologist': 'neurology',
      'dermatologist': 'dermatology',
      'orthopedist': 'orthopedics'
    };
    return mapping[dept] || dept;
  }
}
