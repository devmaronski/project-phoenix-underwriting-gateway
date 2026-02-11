import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import { normalizeError, isRetryable } from '../errors';
import type { ErrorResponse } from '@/types/api.types';

describe('Error Normalization', () => {
  describe('isRetryable()', () => {
    it('should retry on 503 Service Unavailable', () => {
      const error = new AxiosError(
        'Service unavailable',
        '503',
        undefined,
        undefined,
        {
          status: 503,
          statusText: 'Service Unavailable',
          config: {} as any,
          headers: {},
          data: {
            error: { code: 'RISK_SERVICE_DOWN' },
            meta: { requestId: 'req-1' }
          }
        } as any
      );
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(true);
    });

    it('should retry on 500 Internal Server Error', () => {
      const error = new AxiosError(
        'Server error',
        '500',
        undefined,
        undefined,
        {
          status: 500,
          statusText: 'Internal Server Error',
          config: {} as any,
          headers: {},
          data: {
            error: { code: 'INTERNAL_SERVER_ERROR' },
            meta: { requestId: 'req-1' }
          }
        } as any
      );
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(true);
    });

    it('should NOT retry on 404 Not Found', () => {
      const error = new AxiosError('Not found', '404', undefined, undefined, {
        status: 404,
        statusText: 'Not Found',
        config: {} as any,
        headers: {},
        data: {
          error: { code: 'NOT_FOUND' },
          meta: { requestId: 'req-1' }
        }
      } as any);
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(false);
    });

    it('should NOT retry on 422 Validation Error', () => {
      const error = new AxiosError(
        'Validation failed',
        '422',
        undefined,
        undefined,
        {
          status: 422,
          statusText: 'Unprocessable Entity',
          config: {} as any,
          headers: {},
          data: {
            error: { code: 'LEGACY_DATA_CORRUPT' },
            meta: { requestId: 'req-1' }
          }
        } as any
      );
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(false);
    });

    it('should retry on network error (no response)', () => {
      const error = new AxiosError('Network Error');
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(true);
    });

    it('should NOT retry on LEGACY_DATA_CORRUPT regardless of status', () => {
      const error = new AxiosError(
        'Data corrupt',
        '422',
        undefined,
        undefined,
        {
          status: 422,
          statusText: 'Unprocessable Entity',
          config: {} as any,
          headers: {},
          data: {
            error: {
              code: 'LEGACY_DATA_CORRUPT',
              message: 'Data validation failed'
            },
            meta: { requestId: 'req-1' }
          }
        } as any
      );
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(false);
    });

    it('should NOT retry on VALIDATION_FAILED', () => {
      const error = new AxiosError(
        'Validation failed',
        '400',
        undefined,
        undefined,
        {
          status: 400,
          statusText: 'Bad Request',
          config: {} as any,
          headers: {},
          data: {
            error: {
              code: 'VALIDATION_FAILED',
              message: 'Invalid input'
            },
            meta: { requestId: 'req-1' }
          }
        } as any
      );
      expect(isRetryable(error as AxiosError<ErrorResponse>)).toBe(false);
    });
  });

  describe('normalizeError()', () => {
    it('should map 404 to NOT_FOUND with user-friendly message', () => {
      const error = new AxiosError(
        'Loan not found',
        '404',
        undefined,
        undefined,
        {
          status: 404,
          statusText: 'Not Found',
          config: {} as any,
          headers: {},
          data: {
            error: {
              code: 'NOT_FOUND',
              message: 'Loan ID does not exist'
            },
            meta: { requestId: 'req-404' }
          }
        } as any
      );

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.code).toBe('NOT_FOUND');
      expect(normalized.message).toContain('Loan not found');
      expect(normalized.retryable).toBe(false);
      expect(normalized.meta.requestId).toBe('req-404');
    });

    it('should map 503 to RISK_SERVICE_DOWN with retryable flag', () => {
      const error = new AxiosError(
        'Service unavailable',
        '503',
        undefined,
        undefined,
        {
          status: 503,
          statusText: 'Service Unavailable',
          config: {} as any,
          headers: {},
          data: {
            error: {
              code: 'RISK_SERVICE_DOWN',
              message: 'Risk service timeout'
            },
            meta: { requestId: 'req-503' }
          }
        } as any
      );

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.code).toBe('RISK_SERVICE_DOWN');
      expect(normalized.message).toContain('Risk service');
      expect(normalized.retryable).toBe(true);
      expect(normalized.meta.requestId).toBe('req-503');
    });

    it('should map 422 LEGACY_DATA_CORRUPT with non-retryable flag', () => {
      const error = new AxiosError(
        'Data invalid',
        '422',
        undefined,
        undefined,
        {
          status: 422,
          statusText: 'Unprocessable Entity',
          config: {} as any,
          headers: {},
          data: {
            error: {
              code: 'LEGACY_DATA_CORRUPT',
              message: 'Transformation validation failed'
            },
            meta: { requestId: 'req-422' }
          }
        } as any
      );

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.code).toBe('LEGACY_DATA_CORRUPT');
      expect(normalized.message).toContain('corrupted');
      expect(normalized.retryable).toBe(false);
      expect(normalized.meta.requestId).toBe('req-422');
    });

    it('should handle network errors (no response)', () => {
      const error = new AxiosError('Network Error');

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.code).toBe('NETWORK_ERROR');
      expect(normalized.message).toContain('Network');
      expect(normalized.retryable).toBe(true);
      expect(normalized.meta.requestId).toBeUndefined();
    });

    it('should handle non-Axios errors', () => {
      const error = new Error('Unknown error');

      const normalized = normalizeError(error);

      expect(normalized.code).toBe('NETWORK_ERROR');
      expect(normalized.retryable).toBe(true);
    });

    it('should preserve original backend message in meta', () => {
      const error = new AxiosError(
        'Loan not found',
        '404',
        undefined,
        undefined,
        {
          status: 404,
          statusText: 'Not Found',
          config: {} as any,
          headers: {},
          data: {
            error: {
              code: 'NOT_FOUND',
              message: 'Loan ID ABC123 not in database'
            },
            meta: { requestId: 'req-404' }
          }
        } as any
      );

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.meta.originalMessage).toBe(
        'Loan ID ABC123 not in database'
      );
    });

    it('should map AI_TIMEOUT error code', () => {
      const error = new AxiosError('Timeout', '408', undefined, undefined, {
        status: 408,
        statusText: 'Request Timeout',
        config: {} as any,
        headers: {},
        data: {
          error: {
            code: 'AI_TIMEOUT',
            message: 'AI service timed out'
          },
          meta: { requestId: 'req-408' }
        }
      } as any);

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.code).toBe('AI_TIMEOUT');
      expect(normalized.message).toContain('timed out');
      expect(normalized.retryable).toBe(true);
    });

    it('should fallback to UNKNOWN_ERROR for unmapped codes', () => {
      const error = new AxiosError('Unknown', '418', undefined, undefined, {
        status: 418,
        statusText: "I'm a teapot",
        config: {} as any,
        headers: {},
        data: {
          error: { code: 'TEAPOT_ERROR', message: 'I am a teapot' },
          meta: { requestId: 'req-418' }
        }
      } as any);

      const normalized = normalizeError(error as AxiosError<ErrorResponse>);

      expect(normalized.code).toBe('UNKNOWN_ERROR');
      expect(normalized.message).toContain('unexpected error');
      expect(normalized.meta.originalMessage).toBe('I am a teapot');
    });
  });
});
