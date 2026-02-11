/**
 * Tests for formatting utilities.
 */

import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, formatPercent } from '@/utils/format';

describe('Formatting Utilities', () => {
  describe('formatDate', () => {
    it('should format ISO date to readable format', () => {
      const result = formatDate('2025-01-15T10:30:00Z');
      expect(result).toBe('Jan 15, 2025');
    });

    it('should handle different months', () => {
      const result = formatDate('2025-12-25T10:30:00Z');
      expect(result).toBe('Dec 25, 2025');
    });

    it('should handle invalid dates gracefully', () => {
      const result = formatDate('invalid-date');
      expect(result).toMatch(/Invalid date/i);
    });

    it('should handle empty string', () => {
      const result = formatDate('');
      expect(result).toMatch(/Invalid date/i);
    });
  });

  describe('formatCurrency', () => {
    it('should format number as USD currency', () => {
      const result = formatCurrency(250000);
      expect(result).toMatch(/\$250,000/);
    });

    it('should handle decimal amounts', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/\$1,234/);
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$0/);
    });

    it('should handle small amounts', () => {
      const result = formatCurrency(5.5);
      expect(result).toMatch(/\$5/);
    });

    it('should handle large amounts', () => {
      const result = formatCurrency(1000000);
      expect(result).toMatch(/\$1,000,000/);
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with default 1 decimal place', () => {
      const result = formatPercent(6.5);
      expect(result).toBe('6.5%');
    });

    it('should format percentage with custom decimal places', () => {
      const result = formatPercent(6.555, 2);
      expect(result).toMatch(/6\.5[56]%/); // Could round to either 6.55 or 6.56
    });

    it('should handle whole numbers', () => {
      const result = formatPercent(10);
      expect(result).toBe('10.0%');
    });

    it('should handle zero decimals', () => {
      const result = formatPercent(25.7, 0);
      expect(result).toBe('26%');
    });

    it('should handle small percentages', () => {
      const result = formatPercent(0.5);
      expect(result).toBe('0.5%');
    });
  });
});
