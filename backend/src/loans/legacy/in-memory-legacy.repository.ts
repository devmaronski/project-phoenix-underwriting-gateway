import { LegacyLoanRepository } from './legacy.repository';
import { LegacyLoan } from './loan.types';
import { AppError } from '../../common/errors/app-error';

/**
 * In-memory implementation of LegacyLoanRepository
 * Stores loans in a Map for fast lookup by ID
 */
export class InMemoryLegacyRepository implements LegacyLoanRepository {
  private readonly loans: Map<string, LegacyLoan>;

  constructor(loans: LegacyLoan[]) {
    this.loans = new Map(loans.map((loan) => [loan.id, loan]));
  }

  /**
   * Find a loan by ID
   * @param id - The loan ID to search for
   * @returns The loan data
   * @throws AppError with NOT_FOUND code if loan does not exist
   */
  findById(id: string): LegacyLoan {
    const loan = this.loans.get(id);
    if (!loan) {
      throw new AppError('NOT_FOUND', `Loan with ID "${id}" not found`);
    }
    return loan;
  }
}
