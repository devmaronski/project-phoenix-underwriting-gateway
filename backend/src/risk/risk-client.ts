import { LoanSanitized } from '../loans/transform/loan.schema';
import { RiskResponse } from './risk.types';

/**
 * RiskClient interface
 * Abstracts risk scoring from external AI service
 * Implementations may mock, timeout, or fail
 */
export interface IRiskClient {
  scoreRisk(loan: LoanSanitized): Promise<RiskResponse>;
}
