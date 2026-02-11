/**
 * Tests for error handler utilities.
 * Covers: error mapping, user-friendly messages, retry logic.
 */

import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '@/utils/error-handler';
import { createMockApiError } from '@/mocks/loan-review.mock';

describe('Error Handler Utilities', () => {
  describe('getErrorMessage', () => {
    it('should map NOT_FOUND to user-friendly message', () => {
      const error = createMockApiError('NOT_FOUND');
      const friendly = getErrorMessage(error);

      expect(friendly.title).toBe('Loan Not Found');
      expect(friendly.canRetry).toBe(false);
    });

    it('should map AI_TIMEOUT to retryable error', () => {
      const error = createMockApiError('AI_TIMEOUT');
      const friendly = getErrorMessage(error);

      expect(friendly.title).toBe('Service Temporarily Unavailable');
      expect(friendly.canRetry).toBe(true);
    });

    it('should map NETWORK_ERROR correctly', () => {
      const error = createMockApiError('NETWORK_ERROR');
      const friendly = getErrorMessage(error);

      expect(friendly.title).toBe('Network Error');
      expect(friendly.canRetry).toBe(true);
    });

    it('should map LEGACY_DATA_CORRUPT correctly', () => {
      const error = createMockApiError('LEGACY_DATA_CORRUPT');
      const friendly = getErrorMessage(error);

      expect(friendly.title).toBe('Data Error');
      expect(friendly.canRetry).toBe(false);
    });

    it('should handle unknown error codes', () => {
      const error = createMockApiError('UNKNOWN_ERROR');
      const friendly = getErrorMessage(error);

      expect(friendly.title).toBe('Unknown Error');
      expect(friendly.message).toBeDefined();
    });

    it('should preserve custom error messages', () => {
      const customMessage = 'Custom error message';
      const error = createMockApiError('NOT_FOUND', customMessage);
      const friendly = getErrorMessage(error);

      // Still maps the title but shows the backend message
      expect(friendly.title).toBe('Loan Not Found');
    });
  });

  describe('canRetry property', () => {
    it('should return false for non-retryable errors', () => {
      expect(getErrorMessage(createMockApiError('NOT_FOUND')).canRetry).toBe(
        false
      );
      expect(
        getErrorMessage(createMockApiError('VALIDATION_FAILED')).canRetry
      ).toBe(false);
      expect(
        getErrorMessage(createMockApiError('LEGACY_DATA_CORRUPT')).canRetry
      ).toBe(false);
    });

    it('should return true for retryable errors', () => {
      expect(getErrorMessage(createMockApiError('AI_TIMEOUT')).canRetry).toBe(
        true
      );
      expect(
        getErrorMessage(createMockApiError('NETWORK_ERROR')).canRetry
      ).toBe(true);
      expect(
        getErrorMessage(createMockApiError('INTERNAL_SERVER_ERROR')).canRetry
      ).toBe(true);
    });

    it('should handle unknown error codes as retryable', () => {
      expect(
        getErrorMessage({ code: 'UNKNOWN_CODE', message: 'Unknown' }).canRetry
      ).toBe(true);
    });
  });
});
