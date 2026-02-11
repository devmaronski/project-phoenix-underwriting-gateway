import { Injectable, Optional } from '@nestjs/common';
import { IRiskClient } from './risk-client';
import { RiskResponse } from './risk.types';
import { LoanSanitized } from '../loans/transform/loan.schema';
import { AppError } from '../common/errors/app-error';

export interface MockRiskClientOptions {
  failureMode?: 'none' | 'timeout' | 'failure';
  timeoutMs?: number;
}

/**
 * MockRiskClient - Simulates external AI risk scoring service
 * Supports success, timeout, and failure scenarios for testing
 */
@Injectable()
export class MockRiskClient implements IRiskClient {
  private options: MockRiskClientOptions;

  constructor(@Optional() options: MockRiskClientOptions = {}) {
    this.options = {
      failureMode: 'none',
      timeoutMs: 5000,
      ...options,
    };
  }

  async scoreRisk(loan: LoanSanitized): Promise<RiskResponse> {
    // Simulate timeout
    if (this.options.failureMode === 'timeout') {
      await this.delay(this.options.timeoutMs! + 100);
      throw new AppError('AI_TIMEOUT', 'Risk scoring service timed out');
    }

    // Simulate service unavailable
    if (this.options.failureMode === 'failure') {
      throw new AppError(
        'AI_UNAVAILABLE',
        'Risk scoring service is unavailable',
      );
    }

    // Normal operation: simulate API latency
    await this.delay(50);

    // Generate risk reasons
    const reasons = this.generateReasons(loan);
    const score = this.calculateScore(loan);

    return {
      score,
      topReasons: reasons.slice(0, 2),
      allReasons: reasons,
    };
  }

  private generateReasons(loan: LoanSanitized): string[] {
    const reasons: string[] = [];

    if (loan.loan_amount_dollars > 10000) {
      reasons.push('Loan amount exceeds typical threshold');
    }
    if (loan.loan_amount_dollars < 1000) {
      reasons.push('Loan amount is unusually low');
    }

    const loanAge = Date.now() - new Date(loan.issued_date).getTime();
    const yearsOld = loanAge / (1000 * 60 * 60 * 24 * 365);
    if (yearsOld > 5) {
      reasons.push('Loan is aging');
    }

    if (loan.interest_rate_percent > 8) {
      reasons.push('Interest rate is elevated');
    }

    reasons.push('Standard underwriting review required');

    return reasons;
  }

  private calculateScore(loan: LoanSanitized): number {
    let score = 50; // Base score

    if (loan.loan_amount_dollars > 25000) score += 15;
    if (loan.loan_amount_dollars < 500) score += 10;

    const loanAge = Date.now() - new Date(loan.issued_date).getTime();
    const yearsOld = loanAge / (1000 * 60 * 60 * 24 * 365);
    if (yearsOld > 10) score += 10;

    if (loan.interest_rate_percent > 8) score += 5;

    score = Math.min(100, score);
    return Math.max(0, score);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
