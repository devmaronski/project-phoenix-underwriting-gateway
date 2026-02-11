import { Module } from '@nestjs/common';
import { InMemoryLegacyRepository } from './legacy/in-memory-legacy.repository';
import { LegacyLoan } from './legacy/loan.types';

// Import fixtures
import loanValidFixture from './legacy/fixtures/loan-valid.json';
import loanCorruptDateFixture from './legacy/fixtures/loan-corrupt-date.json';
import loanCorruptCentsFixture from './legacy/fixtures/loan-corrupt-cents.json';
import loanMissingRequiredFixture from './legacy/fixtures/loan-missing-required.json';

const fixtures: LegacyLoan[] = [
  loanValidFixture as LegacyLoan,
  loanCorruptDateFixture as LegacyLoan,
  loanCorruptCentsFixture as LegacyLoan,
  loanMissingRequiredFixture as LegacyLoan,
];

@Module({
  providers: [
    {
      provide: 'LegacyLoanRepository',
      useValue: new InMemoryLegacyRepository(fixtures),
    },
  ],
  exports: ['LegacyLoanRepository'],
})
export class LoansModule {}
