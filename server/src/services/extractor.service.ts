import * as chrono from 'chrono-node';

export interface ExtractedEntities {
  date_phrase?: string;
  time_phrase?: string;
  department?: string;
  parsedDate?: Date;
}

export class ExtractionService {
  // Comprehensive list of medical departments and specialist keywords
  private departments = [
    // Original departments
    'cardiology', 'cardiologist',
    'neurology', 'neurologist',
    'dentist', 'dental', 'dentistry',
    'dermatology', 'dermatologist',
    'general',
    'orthopedics', 'orthopedist', 'ortho',
    
    // General / Primary Care
    'gp', 'general practitioner', 'physician', 'family doctor', 'general practice', 'general medicine', 'family medicine',
    
    // Eye Care
    'ophthalmologist', 'ophthalmology', 'optometrist', 'optometry', 'eye doctor', 'eye specialist',
    
    // ENT
    'ent', 'ent specialist', 'otolaryngologist', 'otolaryngology',
    
    // Women's Health
    'gynecologist', 'gynecology', 'gynae', 'gynac', 'obgyn', 'obstetrics and gynecology',
    
    // Children
    'pediatrician', 'pediatrics', 'child doctor', 'paediatrician',
    
    // Mental Health
    'psychiatrist', 'psychiatry', 'psychologist', 'psychology', 'therapist', 'mental health', 'counselor',
    
    // Internal Organs
    'gastroenterologist', 'gastroenterology', 'gastrologist', 'stomach doctor',
    'nephrologist', 'nephrology',
    'urologist', 'urology',
    'hepatologist', 'hepatology',
    'pulmonologist', 'pulmonology', 'chest specialist',
    
    // Bones & Muscles
    'bone doctor', 'physiotherapist', 'physiotherapy', 'physio', 'chiropractor', 'chiropractic',
    'rheumatologist', 'rheumatology',
    
    // Specialized
    'oncologist', 'oncology', 'cancer specialist',
    'endocrinologist', 'endocrinology', 'diabetologist',
    'surgeon', 'general surgery'
  ];

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
  /**
   * Normalize department/specialist names to standard department names
   * Maps various specialist and colloquial terms to proper department names
   */
  private normalizeDepartment(dept: string): string {
    const mapping: { [key: string]: string } = {
      // Cardiology
      'cardiologist': 'Cardiology',
      'cardiology': 'Cardiology',
      
      // Neurology
      'neurologist': 'Neurology',
      'neurology': 'Neurology',
      
      // Dermatology
      'dermatologist': 'Dermatology',
      'dermatology': 'Dermatology',
      
      // Orthopedics
      'orthopedist': 'Orthopedics',
      'orthopedics': 'Orthopedics',
      'ortho': 'Orthopedics',
      'bone doctor': 'Orthopedics',
      
      // Dentistry
      'dentist': 'Dentistry',
      'dental': 'Dentistry',
      'dentistry': 'Dentistry',
      
      // General / Primary Care
      'general': 'General Practice',
      'gp': 'General Practice',
      'general practitioner': 'General Practice',
      'general practice': 'General Practice',
      'physician': 'General Medicine',
      'general medicine': 'General Medicine',
      'family doctor': 'Family Medicine',
      'family medicine': 'Family Medicine',
      
      // Eye Care
      'ophthalmologist': 'Ophthalmology',
      'ophthalmology': 'Ophthalmology',
      'optometrist': 'Optometry',
      'optometry': 'Optometry',
      'eye doctor': 'Ophthalmology',
      'eye specialist': 'Ophthalmology',
      
      // ENT
      'ent': 'Otolaryngology',
      'ent specialist': 'Otolaryngology',
      'otolaryngologist': 'Otolaryngology',
      'otolaryngology': 'Otolaryngology',
      
      // Women's Health
      'gynecologist': 'Gynecology',
      'gynecology': 'Gynecology',
      'gynae': 'Gynecology',
      'gynac': 'Gynecology',
      'obgyn': 'Obstetrics and Gynecology',
      'obstetrics and gynecology': 'Obstetrics and Gynecology',
      
      // Pediatrics
      'pediatrician': 'Pediatrics',
      'pediatrics': 'Pediatrics',
      'child doctor': 'Pediatrics',
      'paediatrician': 'Pediatrics',
      
      // Mental Health
      'psychiatrist': 'Psychiatry',
      'psychiatry': 'Psychiatry',
      'psychologist': 'Psychology',
      'psychology': 'Psychology',
      'therapist': 'Mental Health',
      'mental health': 'Mental Health',
      'counselor': 'Mental Health',
      
      // Gastroenterology
      'gastroenterologist': 'Gastroenterology',
      'gastroenterology': 'Gastroenterology',
      'gastrologist': 'Gastroenterology',
      'stomach doctor': 'Gastroenterology',
      
      // Nephrology
      'nephrologist': 'Nephrology',
      'nephrology': 'Nephrology',
      
      // Urology
      'urologist': 'Urology',
      'urology': 'Urology',
      
      // Hepatology
      'hepatologist': 'Hepatology',
      'hepatology': 'Hepatology',
      
      // Pulmonology
      'pulmonologist': 'Pulmonology',
      'pulmonology': 'Pulmonology',
      'chest specialist': 'Pulmonology',
      
      // Physiotherapy
      'physiotherapist': 'Physiotherapy',
      'physiotherapy': 'Physiotherapy',
      'physio': 'Physiotherapy',
      
      // Chiropractic
      'chiropractor': 'Chiropractic',
      'chiropractic': 'Chiropractic',
      
      // Rheumatology
      'rheumatologist': 'Rheumatology',
      'rheumatology': 'Rheumatology',
      
      // Oncology
      'oncologist': 'Oncology',
      'oncology': 'Oncology',
      'cancer specialist': 'Oncology',
      
      // Endocrinology
      'endocrinologist': 'Endocrinology',
      'endocrinology': 'Endocrinology',
      'diabetologist': 'Endocrinology',
      
      // Surgery
      'surgeon': 'General Surgery',
      'general surgery': 'General Surgery'
    };
    
    return mapping[dept.toLowerCase()] || this.capitalize(dept);
  }

  /**
   * Capitalize first letter of a string
   */
  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
