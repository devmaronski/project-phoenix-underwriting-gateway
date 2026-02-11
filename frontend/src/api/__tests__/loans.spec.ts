import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { loansApi } from '../loans';
import { ErrorCode } from '@/types/api.types';

describe('Loans API Service', () => {
  describe('getReview()', () => {
    it('should fetch loan review successfully', async () => {
      const result = await loansApi.getReview('loan-123');

      expect(result.loan).toBeDefined();
      expect(result.loan.id).toBeDefined();
      expect(result.risk.score).toBeGreaterThanOrEqual(0);
      expect(result.risk.score).toBeLessThanOrEqual(100);
      expect(result.risk.topReasons).toHaveLength(3);
      expect(result.meta.requestId).toBeDefined();
    });

    it('should throw FrontendError on 404 Not Found', async () => {
      try {
        await loansApi.getReview('mock-not-found');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.NOT_FOUND);
        expect(error.message).toContain('not found');
        expect(error.retryable).toBe(false);
        expect(error.meta.requestId).toBeDefined();
      }
    });

    it('should throw FrontendError on 422 LEGACY_DATA_CORRUPT', async () => {
      try {
        await loansApi.getReview('mock-legacy-corrupt');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.LEGACY_DATA_CORRUPT);
        expect(error.message).toContain('corrupted');
        expect(error.retryable).toBe(false);
      }
    });

    it('should throw FrontendError on 503 AI_TIMEOUT', async () => {
      try {
        await loansApi.getReview('mock-timeout');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.AI_TIMEOUT);
        expect(error.retryable).toBe(true);
      }
    });

    it('should throw FrontendError on 503 RISK_SERVICE_DOWN', async () => {
      try {
        await loansApi.getReview('mock-service-down');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.RISK_SERVICE_DOWN);
        expect(error.retryable).toBe(true);
      }
    });

    it('should throw FrontendError on 500 INTERNAL_SERVER_ERROR', async () => {
      try {
        await loansApi.getReview('mock-server-error');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
        expect(error.retryable).toBe(true);
      }
    });

    it('should URL-encode loan ID', async () => {
      let capturedUrl = '';
      server.use(
        http.get('http://localhost:3000/api/loans/:loanId', ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json({
            loan: {
              id: 'test',
              borrower_name: 'Test',
              loan_amount_dollars: 100000,
              issued_date: '2025-01-01T00:00:00Z',
              interest_rate_percent: 5.0,
              term_months: 360,
            },
            risk: { score: 50, topReasons: ['test'] },
            meta: { requestId: 'req-test' },
          });
        })
      );

      await loansApi.getReview('loan-with/special-chars');

      // Verify URL encoding
      expect(capturedUrl).toContain('loan-with%2Fspecial-chars');
    });

    it('should include all required loan fields in response', async () => {
      const result = await loansApi.getReview('loan-123');

      expect(result.loan).toHaveProperty('id');
      expect(result.loan).toHaveProperty('borrower_name');
      expect(result.loan).toHaveProperty('loan_amount_dollars');
      expect(result.loan).toHaveProperty('issued_date');
      expect(result.loan).toHaveProperty('interest_rate_percent');
      expect(result.loan).toHaveProperty('term_months');
    });

    it('should include all required risk fields in response', async () => {
      const result = await loansApi.getReview('loan-123');

      expect(result.risk).toHaveProperty('score');
      expect(result.risk).toHaveProperty('topReasons');
      expect(Array.isArray(result.risk.topReasons)).toBe(true);
    });
  });
});
