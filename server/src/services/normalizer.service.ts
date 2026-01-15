import { toDate, format, toZonedTime } from 'date-fns-tz';

export class NormalizationService {
  private targetTimeZone = 'Asia/Kolkata';

  /**
   * Normalizes a date object to the target timezone (Asia/Kolkata)
   * @param date Date object to normalize
   * @returns { date: string, time: string, tz: string }
   */
  normalizeDateTime(date: Date): { date: string; time: string; tz: string } {
    // Convert the date to the target timezone
    const zonedDate = toZonedTime(date, this.targetTimeZone);

    const dateStr = format(zonedDate, 'yyyy-MM-dd', { timeZone: this.targetTimeZone });
    const timeStr = format(zonedDate, 'HH:mm', { timeZone: this.targetTimeZone });

    return {
      date: dateStr,
      time: timeStr,
      tz: this.targetTimeZone,
    };
  }
}
