import { formatBalance, formatDate } from "@/util/util";

describe('formatBalance', () => {
  it('formats a number with currency prefix', () => {
    expect(formatBalance(12300)).toBe('S/ 12,300');
  });

  it('returns S/ 0 for nullish values', () => {
    expect(formatBalance(null)).toBe('S/ 0');
    expect(formatBalance(undefined)).toBe('S/ 0');
  });

  it('returns S/ 0 for a non numeric string', () => {
    expect(formatBalance('abc')).toBe('S/ 0');
  });
});

describe('formatDate', () => {
  it('formats a Date object as short es-PE date', () => {
    const date = new Date(2025, 3, 15);
    expect(formatDate(date)).toContain('2025');
  });

  it('formats an ISO date string', () => {
    expect(formatDate('2025-04-15')).toContain('2025');
  });

  it('returns empty string for nullish values', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('returns empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});