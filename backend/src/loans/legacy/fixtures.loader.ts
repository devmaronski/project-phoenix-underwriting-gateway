import { LegacyLoan } from './loan.types';
import loanAll from './fixtures/loans-all.json';

/**
 * Load test fixtures for legacy loans
 */
export function loadLoanFixtures(): LegacyLoan[] {
  return loanAll as LegacyLoan[];
}
