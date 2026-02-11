import { Module } from '@nestjs/common';
import { MockRiskClient } from './mock-risk-client';

@Module({
  providers: [MockRiskClient],
  exports: [MockRiskClient],
})
export class RiskModule {}
