import { LegacyLoan } from './loan.types';
import loanValidFixture from './fixtures/loan-valid.json';
import loanCorruptDateFixture from './fixtures/loan-corrupt-date.json';
import loanCorruptCentsFixture from './fixtures/loan-corrupt-cents.json';
import loanMissingRequiredFixture from './fixtures/loan-missing-required.json';

/**
 * Load test fixtures for legacy loans
 */
export function loadLoanFixtures(): LegacyLoan[] {
  return [
    loanValidFixture as LegacyLoan,
    loanCorruptDateFixture as LegacyLoan,
    loanCorruptCentsFixture as LegacyLoan,
    loanMissingRequiredFixture as LegacyLoan,
  ];
}
