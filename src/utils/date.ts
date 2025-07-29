import { parseISO, format, isValid, startOfDay, endOfDay, addHours } from 'date-fns';

export class DateUtils {
  /**
   * Parse a date string and return a Date object
   */
  static parseDate(dateString: string): Date {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      throw new Error('Invalid date format');
    }
    return date;
  }

  /**
   * Check if a date string is valid
   */
  static isValidDate(dateString: string): boolean {
    try {
      const date = parseISO(dateString);
      return isValid(date);
    } catch {
      return false;
    }
  }

  /**
   * Format a date to ISO string
   */
  static formatToISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Get start of day for a given date
   */
  static getStartOfDay(date: Date): Date {
    return startOfDay(date);
  }

  /**
   * Get end of day for a given date
   */
  static getEndOfDay(date: Date): Date {
    return endOfDay(date);
  }

  /**
   * Check if two dates overlap
   */
  static isTimeOverlapping(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && start2 < end1;
  }

  /**
   * Create a datetime from date and time strings
   */
  static createDateTime(dateString: string, timeString: string): Date {
    // Expected format: date = "2024-01-15", time = "10:00"
    const combinedString = `${dateString}T${timeString}:00`;
    return this.parseDate(combinedString);
  }

  /**
   * Add hours to a date
   */
  static addHours(date: Date, hours: number): Date {
    return addHours(date, hours);
  }

  /**
   * Calculate duration in hours between two dates
   */
  static getDurationInHours(start: Date, end: Date): number {
    const diffInMs = end.getTime() - start.getTime();
    return Math.round(diffInMs / (1000 * 60 * 60));
  }
}

export default DateUtils;
