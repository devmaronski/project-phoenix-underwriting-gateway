import { MockRiskClient } from './mock-risk-client';
import { LoanSanitized } from '../loans/transform/loan.schema';
import { AppError } from '../common/errors/app-error';

describe('MockRiskClient', () => {
  let client: MockRiskClient;

  beforeEach(() => {
    client = new MockRiskClient();
  });

  describe('scoreRisk - Success Path', () => {
    it('should score a valid loan and return risk response', async () => {
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 5000,
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      const result = await client.scoreRisk(loan);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.topReasons)).toBe(true);
      expect(result.topReasons.length).toBeGreaterThan(0);
      expect(Array.isArray(result.allReasons)).toBe(true);
      expect(result.allReasons!.length >= result.topReasons.length).toBe(true);
    });

    it('should return deterministic score for same loan', async () => {
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 5000,
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      const result1 = await client.scoreRisk(loan);
      const result2 = await client.scoreRisk(loan);

      expect(result1.score).toBe(result2.score);
      expect(result1.topReasons).toEqual(result2.topReasons);
    });

    it('should include meaningful risk reasons', async () => {
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 50000, // High amount
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      const result = await client.scoreRisk(loan);

      expect(result.topReasons.length >= 1).toBe(true);
      expect(result.allReasons!.length >= result.topReasons.length).toBe(true);
    });
  });

  describe('scoreRisk - Timeout Simulation', () => {
    it('should throw AI_TIMEOUT when timeout is enabled', async () => {
      const timeoutClient = new MockRiskClient({
        failureMode: 'timeout',
        timeoutMs: 10,
      });
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 5000,
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      await expect(timeoutClient.scoreRisk(loan)).rejects.toThrow(AppError);
    });

    it('should have AI_TIMEOUT error code', async () => {
      const timeoutClient = new MockRiskClient({
        failureMode: 'timeout',
        timeoutMs: 10,
      });
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 5000,
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      try {
        await timeoutClient.scoreRisk(loan);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('AI_TIMEOUT');
      }
    });
  });

  describe('scoreRisk - Failure Simulation', () => {
    it('should throw AI_UNAVAILABLE when service is unavailable', async () => {
      const failureClient = new MockRiskClient({ failureMode: 'failure' });
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 5000,
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      await expect(failureClient.scoreRisk(loan)).rejects.toThrow(AppError);
    });

    it('should have AI_UNAVAILABLE error code', async () => {
      const failureClient = new MockRiskClient({ failureMode: 'failure' });
      const loan: LoanSanitized = {
        id: 'loan-1',
        borrower_name: 'John Doe',
        loan_amount_dollars: 5000,
        issued_date: '2023-01-01T00:00:00.000Z',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      try {
        await failureClient.scoreRisk(loan);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('AI_UNAVAILABLE');
      }
    });
  });
});
