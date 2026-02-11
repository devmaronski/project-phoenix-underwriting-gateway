import { LegacyLoanRepository } from './legacy.repository';
import { LegacyLoan } from './loan.types';
import { AppError } from '../../common/errors/app-error';

/**
 * Test implementation that holds loans in memory for testing
 */
class TestLegacyLoanRepository implements LegacyLoanRepository {
  private loans: Map<string, LegacyLoan>;

  constructor(loans: LegacyLoan[]) {
    this.loans = new Map(loans.map((loan) => [loan.id, loan]));
  }

  findById(id: string): LegacyLoan {
    const loan = this.loans.get(id);
    if (!loan) {
      throw new AppError('NOT_FOUND', `Loan with ID "${id}" not found`);
    }
    return loan;
  }
}

describe('LegacyLoanRepository', () => {
  const validLoan: LegacyLoan = {
    id: 'LOAN-001',
    borrower_name: 'John Doe',
    loan_amount_cents: 50000,
    issued_date: '2024-01-15',
    interest_rate_percent: 5.5,
    term_months: 60,
  };

  let repository: LegacyLoanRepository;

  beforeEach(() => {
    repository = new TestLegacyLoanRepository([validLoan]);
  });

  describe('findById', () => {
    it('should find a valid loan by ID', () => {
      const result = repository.findById('LOAN-001');
      expect(result).toEqual(validLoan);
    });

    it('should throw NOT_FOUND error for missing loan ID', () => {
      expect(() => {
        repository.findById('NONEXISTENT');
      }).toThrow(AppError);

      try {
        repository.findById('NONEXISTENT');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe('NOT_FOUND');
      }
    });
  });
});
