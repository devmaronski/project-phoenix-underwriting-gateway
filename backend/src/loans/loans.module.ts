import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { InMemoryLegacyRepository } from './legacy/in-memory-legacy.repository';
import { loadLoanFixtures } from './legacy/fixtures.loader';
import { RiskModule } from '../risk/risk.module';

@Module({
  imports: [RiskModule],
  controllers: [LoansController],
  providers: [
    LoansService,
    {
      provide: InMemoryLegacyRepository,
      useFactory: () => {
        const fixtures = loadLoanFixtures();
        return new InMemoryLegacyRepository(fixtures);
      },
    },
  ],
})
export class LoansModule {}
