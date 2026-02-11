import { LegacyLoan } from './loan.types';

/**
 * LegacyLoanRepository - Interface for accessing raw legacy loan data
 */
export interface LegacyLoanRepository {
  /**
   * Find a loan by ID
   * @param id - The loan ID
   * @returns The loan data
   * @throws NOT_FOUND error if loan does not exist
   */
  findById(id: string): LegacyLoan;
}
