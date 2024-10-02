import { describe, it, expect } from 'vitest';
import formatDateTime from './formatDateTime';

describe('formatDateTime', () => {
  it('should format a valid date-time string correctly', () => {
    const input = '2023-10-05T14:48:00';
    const expectedOutput = '2023-10-05 14:48:00';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  it('should handle single-digit months and days correctly', () => {
    const input = '2023-1-5T04:08:09';
    const expectedOutput = '2023-1-5 04:08:09';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  it('should throw an error for an invalid date-time string', () => {
    const input = '2023-10-05';
    expect(() => formatDateTime(input)).toThrow();
  });

  it('should handle a date-time string without seconds correctly', () => {
    const input = '2023-10-05T14:48';
    const expectedOutput = '2023-10-05 14:48:00';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });
});
