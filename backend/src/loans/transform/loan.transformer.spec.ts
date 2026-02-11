import { transformLoan } from './loan.transformer';
import { LegacyLoan } from '../legacy/loan.types';
import { AppError } from '../../common/errors/app-error';

describe('LoanTransformer', () => {
  describe('valid loan', () => {
    it('should convert cents to decimal', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-001',
        borrower_name: 'John Doe',
        loan_amount_cents: 100000,
        issued_date: '2024-01-15',
        interest_rate_percent: 5.5,
        term_months: 60,
      };

      const result = transformLoan(raw);

      expect(result.loan_amount_dollars).toBe(1000);
      expect(result.id).toBe('LOAN-001');
      expect(result.borrower_name).toBe('John Doe');
      expect(result.interest_rate_percent).toBe(5.5);
      expect(result.term_months).toBe(60);
    });

    it('should normalize date to UTC ISO8601', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-002',
        borrower_name: 'Jane Smith',
        loan_amount_cents: 50000,
        issued_date: '2024-02-20',
        interest_rate_percent: 6.0,
        term_months: 48,
      };

      const result = transformLoan(raw);

      expect(result.issued_date).toBe('2024-02-20T00:00:00.000Z');
    });

    it('should handle zero cents', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-003',
        borrower_name: 'Bob Johnson',
        loan_amount_cents: 0,
        issued_date: '2024-03-10',
        interest_rate_percent: 4.5,
        term_months: 36,
      };

      const result = transformLoan(raw);

      expect(result.loan_amount_dollars).toBe(0);
    });
  });

  describe('validation errors', () => {
    it('should reject negative cents with LEGACY_DATA_CORRUPT', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-004',
        borrower_name: 'Alice Williams',
        loan_amount_cents: -5000,
        issued_date: '2024-04-15',
        interest_rate_percent: 5.0,
        term_months: 60,
      };

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
        expect((error as AppError).details?.field).toBe('loan_amount_cents');
      }
    });

    it('should reject non-integer cents with LEGACY_DATA_CORRUPT', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-005',
        borrower_name: 'Charlie Brown',
        loan_amount_cents: 25000.5,
        issued_date: '2024-05-20',
        interest_rate_percent: 5.25,
        term_months: 72,
      };

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
        expect((error as AppError).details?.field).toBe('loan_amount_cents');
      }
    });

    it('should reject non-numeric cents with LEGACY_DATA_CORRUPT', () => {
      const raw = {
        id: 'LOAN-005B',
        borrower_name: 'Charlie Brown',
        loan_amount_cents: '25000' as unknown as number,
        issued_date: '2024-05-20',
        interest_rate_percent: 5.25,
        term_months: 72,
      } as LegacyLoan;

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
        expect((error as AppError).details?.field).toBe('loan_amount_cents');
      }
    });

    it('should reject invalid date format with LEGACY_DATA_CORRUPT', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-006',
        borrower_name: 'Diana Prince',
        loan_amount_cents: 100000,
        issued_date: '01-15-2024',
        interest_rate_percent: 5.75,
        term_months: 48,
      };

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
        expect((error as AppError).details?.field).toBe('issued_date');
      }
    });

    it('should reject missing required field loan_amount_cents with LEGACY_DATA_CORRUPT', () => {
      const raw = {
        id: 'LOAN-007',
        borrower_name: 'Eve Johnson',
        issued_date: '2024-06-10',
        interest_rate_percent: 5.5,
        term_months: 60,
      } as unknown as LegacyLoan;

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
      }
    });

    it('should reject missing required field issued_date with LEGACY_DATA_CORRUPT', () => {
      const raw = {
        id: 'LOAN-008',
        borrower_name: 'Frank Miller',
        loan_amount_cents: 75000,
        interest_rate_percent: 6.0,
        term_months: 36,
      } as unknown as LegacyLoan;

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
      }
    });

    it('should reject loan with malformed date without timezone', () => {
      const raw: LegacyLoan = {
        id: 'LOAN-009',
        borrower_name: 'Grace Hopper',
        loan_amount_cents: 60000,
        issued_date: 'not-a-date',
        interest_rate_percent: 5.0,
        term_months: 48,
      };

      expect(() => transformLoan(raw)).toThrow(AppError);

      try {
        transformLoan(raw);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('LEGACY_DATA_CORRUPT');
        expect((error as AppError).details?.field).toBe('issued_date');
      }
    });
  });
});
