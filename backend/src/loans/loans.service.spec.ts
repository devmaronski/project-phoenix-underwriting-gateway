import { LoansService } from './loans.service';
import type { LoanResponseDto } from './dto/loan-response.dto';
import { InMemoryLegacyRepository } from './legacy/in-memory-legacy.repository';
import { MockRiskClient } from '../risk/mock-risk-client';
import { LegacyLoan } from './legacy/loan.types';
import { AppError } from '../common/errors/app-error';
import type { IRiskClient } from '../risk/risk-client';
import type { RiskResponse } from '../risk/risk.types';

describe('LoansService', () => {
  let service: LoansService;
  let legacyRepo: InMemoryLegacyRepository;
  let riskClient: MockRiskClient;

  const validLoan: LegacyLoan = {
    id: 'loan-1',
    borrower_name: 'John Doe',
    loan_amount_cents: 500000, // $5000
    issued_date: '2023-01-01',
    interest_rate_percent: 5.5,
    term_months: 60,
  };

  const corruptLoan: LegacyLoan = {
    id: 'loan-corrupt',
    borrower_name: 'Jane Doe',
    loan_amount_cents: 500000,
    issued_date: 'invalid-date',
    interest_rate_percent: 5.5,
    term_months: 60,
  };

  beforeEach(() => {
    legacyRepo = new InMemoryLegacyRepository([validLoan, corruptLoan]);
    riskClient = new MockRiskClient();
    service = new LoansService(legacyRepo, riskClient);
  });

  describe('getLoan', () => {
    it('should return loan with risk score for valid loan ID', async () => {
      const result: LoanResponseDto = await service.getLoan('loan-1');

      expect(result).toHaveProperty('loan');
      expect(result).toHaveProperty('risk');
      expect(result.loan).toHaveProperty('id');
      expect(result.loan).toHaveProperty('borrower_name');
      expect(result.loan).toHaveProperty('loan_amount_dollars');
      expect(result.loan).toHaveProperty('issued_date');
      expect(result.risk).toHaveProperty('score');
      expect(result.risk).toHaveProperty('topReasons');
      const risk = result.risk;
      expect(Array.isArray(risk.topReasons)).toBe(true);
    });

    it('should throw NOT_FOUND for non-existent loan', async () => {
      await expect(service.getLoan('non-existent')).rejects.toThrow(AppError);
    });

    it('should throw NOT_FOUND with correct error code', async () => {
      try {
        await service.getLoan('non-existent');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('NOT_FOUND');
      }
    });

    it('should throw LEGACY_DATA_CORRUPT for corrupt data', async () => {
      await expect(service.getLoan('loan-corrupt')).rejects.toThrow(AppError);
    });

    it('should throw LEGACY_DATA_CORRUPT with correct error code', async () => {
      try {
        await service.getLoan('loan-corrupt');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
      }
    });

    it('should propagate AI_TIMEOUT from risk client', async () => {
      const timeoutClient = new MockRiskClient({
        failureMode: 'timeout',
        timeoutMs: 10,
      });
      const timeoutService = new LoansService(legacyRepo, timeoutClient);

      try {
        await timeoutService.getLoan('loan-1');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('AI_TIMEOUT');
      }
    }, 10000);

    it('should propagate AI_UNAVAILABLE from risk client', async () => {
      const failureClient = new MockRiskClient({ failureMode: 'failure' });
      const failureService = new LoansService(legacyRepo, failureClient);

      try {
        await failureService.getLoan('loan-1');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('AI_UNAVAILABLE');
      }
    });

    it('should map unknown risk client errors to AI_UNAVAILABLE', async () => {
      class FailingRiskClient implements IRiskClient {
        scoreRisk(): Promise<RiskResponse> {
          return Promise.reject(new Error('Unexpected failure'));
        }
      }

      const failingService = new LoansService(
        legacyRepo,
        new FailingRiskClient(),
      );

      try {
        await failingService.getLoan('loan-1');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('AI_UNAVAILABLE');
      }
    });
  });
});
