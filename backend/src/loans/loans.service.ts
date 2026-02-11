import { Inject, Injectable } from '@nestjs/common';
import { InMemoryLegacyRepository } from './legacy/in-memory-legacy.repository';
import type { IRiskClient } from '../risk/risk-client';
import { MockRiskClient } from '../risk/mock-risk-client';
import type { LoanResponseDto } from './dto/loan-response.dto';
import { transformLoan } from './transform/loan.transformer';
import { AppError } from '../common/errors/app-error';

/**
 * LoansService - Orchestrates loan retrieval, transformation, and risk scoring
 */
@Injectable()
export class LoansService {
  constructor(
    private legacyRepository: InMemoryLegacyRepository,
    @Inject(MockRiskClient) private riskClient: IRiskClient,
  ) {}

  /**
   * Get a loan by ID, transform it, and score its risk
   * @param id - Loan ID
   * @returns Loan with risk score
   * @throws AppError with NOT_FOUND, LEGACY_DATA_CORRUPT, AI_TIMEOUT, or AI_UNAVAILABLE
   */
  async getLoan(id: string): Promise<LoanResponseDto> {
    // Step 1: Fetch from legacy repository
    let legacyLoan;
    try {
      legacyLoan = this.legacyRepository.findById(id);
    } catch (error) {
      // Repository throws NOT_FOUND, propagate it
      if (error instanceof AppError && error.code === 'NOT_FOUND') {
        throw error;
      }
      throw error;
    }

    // Step 2: Transform to sanitized format (throws LEGACY_DATA_CORRUPT if invalid)
    const sanitizedLoan = transformLoan(legacyLoan);

    // Step 3: Get risk score (may throw AI_TIMEOUT or AI_UNAVAILABLE)
    const riskScore = await this.riskClient.scoreRisk(sanitizedLoan);

    return {
      loan: sanitizedLoan,
      risk: riskScore,
    };
  }
}
